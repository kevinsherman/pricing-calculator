import { playerInput } from "../models/playerInput";
import * as _ from 'lodash';
import { PlayersInputParameters } from "../models/playersInputParameters";
import { PlayersOutput } from '../models/playersOutput';
import { statCategory } from "../models/statCategory";

export function zScoreForCountingStat(players: playerInput[], cat: statCategory, input: PlayersInputParameters, calc: PlayersOutput) {

    var populationCount = input.numberOfPlayersDrafted;
    var thisGroup = players.slice(0, populationCount);
    var totalValue = _.sumBy(thisGroup, cat.inputName);
    var populationMean = totalValue / populationCount;

    calc.averages[calc.numberOfIterations].push({ key: cat.name, value: populationMean });

    var sumOfSquaredDeviation = 0;
    thisGroup.forEach(function (item) {
        sumOfSquaredDeviation += Math.pow(item[cat.inputName] - populationMean, 2);
    });

    var standardDeviation = Math.sqrt(sumOfSquaredDeviation / populationCount);

    calc.stdDevs[calc.numberOfIterations].push({ key: cat.name, value: standardDeviation });

    players.forEach(function (item) {
        var zScore = (item[cat.inputName] - populationMean) / standardDeviation;
        item[cat.zScoreName] = zScore;
    });
}
