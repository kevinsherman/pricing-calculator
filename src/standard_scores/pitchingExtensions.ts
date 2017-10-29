import { pitchingInput } from '../models/pitchingInput';
import { PlayersOutput } from '../models/playersOutput';
import { PlayersInputParameters } from '../models/playersInputParameters';
import * as _ from 'lodash';
import { zScoreForCountingStat } from './zScoreForCountingStat';
import { statCategory } from '../models/statCategory';

export class PitchingExtensions {

    constructor(private calc: PlayersOutput, private input: PlayersInputParameters) {

    }

    Ip(players: pitchingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    K(players: pitchingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    W(players: pitchingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    S(players: pitchingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    Era(players: pitchingInput[], item: statCategory) {

        var populationCount = this.input.numberOfPlayersDrafted;
        // 1. Calculate the xERA for each Player...
        var totalValue = 0;
        var thisGroup = players.slice(0, populationCount);

        var totalEarnedRuns = _.sumBy(thisGroup, 'er');
        var totalInningsPitched = _.sumBy(thisGroup, 'ip');

        // should this be in averages or xStatAverages ??? (same with batting!)
        var populationEarnedRunAverage = totalEarnedRuns / totalInningsPitched;
        this.calc.xStatAverages[this.calc.numberOfIterations].push({ key: "ERA", value: populationEarnedRunAverage });

        //xERA = ( ER - (IP * league_average) ) * -1
        var counter = 0;
        players.forEach(function (p) {
            var value = (p.er - (p.ip * populationEarnedRunAverage)) * -1;
            p.xEra = value;
            if (counter < populationCount) {
                totalValue += value;
            }
            counter++;
        });

        // 2. Calculate zScore of xERA
        var populationMean = totalValue / populationCount;
        this.calc.averages[this.calc.numberOfIterations].push({ key: "xEra", value: populationMean });

        var sumOfSquaredDeviation = 0;
        thisGroup.forEach(function (item) {
            sumOfSquaredDeviation += Math.pow(item.xEra - populationMean, 2);
        });

        var standardDeviation = Math.sqrt(sumOfSquaredDeviation / populationCount);
        this.calc.stdDevs[this.calc.numberOfIterations].push({ key: "xEra", value: standardDeviation });

        players.forEach(function (p) {
            p.zEra = (p.xEra - populationMean) / standardDeviation;
        });
    }

    Whip(players: pitchingInput[], item: statCategory) {

        var populationCount = this.input.numberOfPlayersDrafted;

        // 1. Calculate the xWHIP for each Player...
        var totalValue = 0;
        var thisGroup = players.slice(0, populationCount);

        var totalWalksPlusHits = _.sumBy(thisGroup, 'bb') + _.sumBy(thisGroup, 'h');
        var totalInningsPitched = _.sumBy(thisGroup, 'ip');

        var populationWhip = totalWalksPlusHits / totalInningsPitched;

        // should this be in averages or xStatAverages ??? (same with batting!)
        this.calc.xStatAverages[this.calc.numberOfIterations].push({ key: "WHIP", value: populationWhip });

        //xWHIP - ( (BB + H) - (IP * league_average) ) * -1
        var counter = 0;
        players.forEach(function (p) {
            var value = ((p.bb + p.h) - (p.ip * populationWhip)) * -1;
            p.xWhip = value;
            if (counter < populationCount) {
                totalValue += value;
            }
            counter++;
        });

        // 2. Calculate zScore of xWHIP
        var populationMean = totalValue / populationCount;
        this.calc.averages[this.calc.numberOfIterations].push({ key: "xWhip", value: populationMean });

        var sumOfSquaredDeviation = 0;
        thisGroup.forEach(function (item) {
            sumOfSquaredDeviation += Math.pow(item.xWhip - populationMean, 2);
        });

        var standardDeviation = Math.sqrt(sumOfSquaredDeviation / populationCount);
        this.calc.stdDevs[this.calc.numberOfIterations].push({ key: "xWhip", value: standardDeviation });

        players.forEach(function (p) {
            p.zWhip = (p.xWhip - populationMean) / standardDeviation;
        });

    }
}
