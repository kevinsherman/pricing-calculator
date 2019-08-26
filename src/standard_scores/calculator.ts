import { PlayersInputParameters } from '../models/playersInputParameters';
import { PlayersOutput } from '../models/playersOutput';
import { playerInput } from '../models/playerInput';
import { KeyValuePair } from '../common/helpers';
import { CalculatorParameters } from '../models/caclulatorParameters';
import { BattingExtensions } from './battingExtensions';
import { PitchingExtensions } from './pitchingExtensions';
import { battingInput } from '../models/battingInput';
import { pitchingInput } from '../models/pitchingInput';
import * as _ from 'lodash';
import * as c from '../common/constants';
// import { toCsv } from '../common/helpers'; 

export class Calculator {

    public players: playerInput[];
    public input: PlayersInputParameters;

    public output: PlayersOutput;

    constructor(players: playerInput[], private request: CalculatorParameters, private statType: string) {
        this.players = players;
        this.input = (statType === c.Batting) ? request.hittersInput : request.pitchersInput;
        this.statType = statType;
        this.output = new PlayersOutput();
    }

    calculate(): PlayersOutput {

        var isSettled = false;

        this.statType === c.Batting ?
            this.buildBattingComponents() : this.buildPitchingComponents();

        do {

            var i = this.output.numberOfIterations;
            console.log(this.statType + ' iterations: ' + i);

            // Step 1: StandardScores
            this.output.averages.push([]);
            this.output.stdDevs.push([]);
            this.output.xStatAverages.push([]);

            this.calculateStandardScores();

            this.players = _.orderBy(this.players, (player) => player.total, ['desc']);

            if (i > 0) {

                let current = this.output.stdDevs[i];
                let last = this.output.stdDevs[i - 1];

                isSettled = _.isEqual(current, last);

                if (isSettled) {
                    // Step 2: Adjust for Replacement
                    this.output.replacementLevels = this.adjustForReplacementLevels();

                    this.players = _.orderBy(this.players, (player) => player.adjTotal, ['desc']);
                }
            }

            this.output.numberOfIterations++;

        } while (!isSettled);

        return this.output;
    }

    private adjustForReplacementLevels(): any {

        var replacementLevels: any = {};
        var self = this;

        this.players.forEach(function (player) {
            player.isAboveReplacement = false;
        });

        // if (this.statType === "Batting")
        //     toCsv(this.players, "before_replacement");

        var filteredPositions = this.input.positions.filter(x => x.value > 0);

        filteredPositions.forEach(function (position) {
            var posKey = position.key;
            var playersAtPosition = self.request.numberOfTeams * position.value;

            // chains: https://blog.mariusschulz.com/2015/05/14/implicit-function-chains-in-lodash
            var thisGroup = _(self.players)
                // filter by players who match the postion and have not already been selected
                .filter(item => _.includes(item.pos, position.key) && item.isAboveReplacement === false)
                // sort them descending by their total value
                .orderBy(x => x.total, ['desc'])
                // take the required number
                .take(playersAtPosition)
                .value();

            replacementLevels[posKey] = thisGroup[playersAtPosition - 1].total;

            thisGroup.forEach(function (player) {
                player.isAboveReplacement = true;
                player.chosenPosition = posKey;
            })
        });

        // Lastly, just need to set the adjustment and adjusted amount per player...
        filteredPositions.forEach(function (position) {
            var groupToAdjust = _(self.players)
                .filter(item => (item.chosenPosition === position.key || _.includes(item.pos, position.key) && !item.isAboveReplacement))
                .value();

            var adjustment: number = replacementLevels[position.key];

            groupToAdjust.forEach(function (player) {
                player.adjustment = adjustment;
                player.adjTotal = player.total - adjustment;
            })

        })

        // if (this.statType === "Batting")
        //     toCsv(this.players, "after_adjustment");

        return replacementLevels;
    }

    buildBattingComponents(): void {

        this.players.forEach(function (player) {
            player.s = player.h - (player.d + player.t + player.hr);
            player.tb = player.s + (2 * player.d) + (3 * player.t) + (4 * player.hr);

            // OBP
            let obpNumerator = player.h + player.bb + player.hbp;
            let obpDenominator = player.ab + player.bb + player.hbp + player.sf;
            player.pa = obpDenominator;
            let slgNumerator = player.tb;
            let slgDenominator = player.ab;

            if (slgDenominator == 0) {
                player.ops = 0;
                player.ba = 0;
            } else {
                player.ops = (obpNumerator / obpDenominator) + (slgNumerator / slgDenominator);
                player.avg = player.h / player.ab;
            }
        });
    }

    buildPitchingComponents() {
        this.players.forEach(function (p) {
            p.ip = p.outs / 3;
            p.whip = p.ip === 0 ? 0 : (p.bb + p.h) / p.ip;
            p.era = p.ip === 0 ? 0 : 9 * p.er / p.ip;
        });
    }

    calculateStandardScores(): void {

        var type: any = this.statType === c.Batting
            ? new BattingExtensions(this.output, this.input)
            : new PitchingExtensions(this.output, this.input);

        this.input.statCategories.forEach((item) => {
            type[item.name](this.players, item);
        })

        this.getTotals();
    }

    getTotals() {

        var self = this;

        this.players.forEach(function (player) {
            var total = 0;
            self.input.statCategories.forEach((item) => {
                total += player[item.zScoreName];
            });

            player.total = total;
        });
    }
}
