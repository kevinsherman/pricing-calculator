import { CalculatorParameters } from "../models/caclulatorParameters";
import { playerInput } from "../models/playerInput";
import * as c from './constants';
import { statCategory } from "../models/statCategory";
import * as fs from 'fs';
import * as moment from 'moment';
const jsonexport = require('jsonexport');

export class KeyValuePair {
    key: string;
    value: number;
}

export function processCategories(input: string[], statType: string): statCategory[] {

    var ret: statCategory[] = [];

    if (statType === c.Batting) {
        input.forEach(element => {
            var s: any = {};
            switch (element) {
                case ("HR"):
                    s.name = "Hr";
                    s.zScoreName = "zHr";
                    s.inputName = "hr";
                    break;
                case ("SB"):
                    s.name = "Sb";
                    s.zScoreName = "zSb";
                    s.inputName = "sb";
                    break;
                case ("R"):
                    s.name = "R";
                    s.zScoreName = "zR";
                    s.inputName = "r";
                    break;
                case ("RBI"):
                    s.name = "Rbi";
                    s.zScoreName = "zRbi";
                    s.inputName = "rbi";
                    break;
                case ("OPS"):
                    s.name = "Ops";
                    s.zScoreName = "zOps";
                    s.inputName = null;
                    break;
                case ("AVG"):
                    s.name = "Ba";
                    s.zScoreName = "zBa";
                    s.inputName = null;
                    break;
            }

            ret.push(s);
        });
    } else {
        input.forEach(element => {
            var s: any = {};
            switch (element) {
                case ("ERA"):
                    s.name = "Era";
                    s.zScoreName = "zEra";
                    s.inputName = null;
                    break;
                case ("WHIP"):
                    s.name = "Whip";
                    s.zScoreName = "zWhip";
                    s.inputName = null;
                    break;
                case ("IP"):
                    s.name = "Ip";
                    s.zScoreName = "zIp";
                    s.inputName = "ip";
                    break;
                case ("K"):
                    s.name = "K";
                    s.zScoreName = "zK";
                    s.inputName = "so";
                    break;
                case ("W"):
                    s.name = "W";
                    s.zScoreName = "zW";
                    s.inputName = "w";
                    break;
                case ("S"):
                    s.name = "S";
                    s.zScoreName = "zS";
                    s.inputName = "sv";
                    break;
            }

            ret.push(s);
        });
    }

    return ret;
}

export function toCsv(input: any[], fileName: string): void {
    var time = moment(Date.now()).format("HH-mm-ss");
    var outFile = 'data/output/' + time + "_" + fileName + ".csv";

    jsonexport(input, function (err: any, csv: any): void {
        if (err) return console.log(err);
        fs.writeFile(outFile, csv, function (err) {
            if (err) console.log(err);
        });
    })
}

export function processPlayers(calculatorParameters: CalculatorParameters,
    playerInputs: playerInput[],
    playerType: string): playerInput[] {

    var players: playerInput[] = playerInputs;
    var input = (playerType === c.Batting) ?
        calculatorParameters.hittersInput :
        calculatorParameters.pitchersInput;

    if (playerType === c.Batting) {

        players.forEach(function (player: any) {

            player.pos = [];

            input.minGames.forEach(function (position) {

                let positionKey = position.key
                let positionCount = position.value

                switch (positionKey) {
                    case "C":
                    case "SS":
                    case "2B":
                    case "3B":
                    case "1B":
                        if (player["G_" + positionKey] >= positionCount) {
                            player.pos.push(positionKey);
                        }
                        break;
                    case "OF":
                        let lf = player["G_LF"];
                        let cf = player["G_CF"];
                        let rf = player["G_RF"];

                        if (((lf + cf + rf) >= positionCount) || (cf >= positionCount) || (rf >= positionCount) || (lf >= positionCount)) {
                            player.pos.push(positionKey);
                        }
                        break;
                    case "MI":
                        let ss = player["G_SS"];
                        let secondBase = player["G_2B"];

                        if (((ss + secondBase) >= positionCount) || (secondBase >= positionCount) || (ss >= positionCount)) {
                            player.pos.push(positionKey);
                        }
                        break;
                    case "CI":
                        let firstBase = player["G_1B"];
                        let thirdBase = player["G_3B"];

                        if (((firstBase + thirdBase) >= positionCount) || (thirdBase >= positionCount) || (firstBase >= positionCount)) {
                            player.pos.push(positionKey);
                        }
                        break;
                    case "DH":
                        player.pos.push(positionKey);
                        break;
                }
            });
        });
    }
    else {

        players.forEach(function (player: any) {
            // TODO: Need to work on this, for now, just hacking to add "P" to pos
            player.pos = [];
            player.pos.push("P")
        });
    }

    return players;
}
