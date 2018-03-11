import { battingInput } from '../models/battingInput';
import * as _ from 'lodash';
import { PlayersOutput } from '../models/playersOutput';
import { PlayersInputParameters } from '../models/playersInputParameters';
import { zScoreForCountingStat } from './zScoreForCountingStat';
import { statCategory } from '../models/statCategory';

export class BattingExtensions {

    constructor(private calc: PlayersOutput, private input: PlayersInputParameters) {

    }

    Hr(players: battingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    R(players: battingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    Sb(players: battingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    Rbi(players: battingInput[], item: statCategory) {
        zScoreForCountingStat(players, item, this.input, this.calc);
    }

    Ba(players: battingInput[], item: statCategory) {

        var populationCount = this.input.numberOfPlayersDrafted;
        var thisGroup = players.slice(0, populationCount);

        // 1. Calculate xH for each Player...
        var totalHits = _.sumBy(thisGroup, 'h');
        var totalAtBats = _.sumBy(thisGroup, 'ab');
        var totalValue = 0;

        // get the population batting average...
        var populationBattingAverage = totalHits / totalAtBats;
        this.calc.xStatAverages[this.calc.numberOfIterations].push({ key: "AVG", value: populationBattingAverage });

        // xH = (H - (AB * league_average))
        var counter = 0;

        players.forEach(function (i) {
            var total = i.h - (i.ab * populationBattingAverage);
            i.xAVG = total;
            if (counter < populationCount) {
                totalValue += total;
            }
            counter++;
        });

        // 2. Calculate zScore of xAVG...
        var populationMean = totalValue / populationCount;

        this.calc.averages[this.calc.numberOfIterations].push({ key: "xAVG", value: populationMean });

        var sumOfSquaredDeviation = 0;
        thisGroup.forEach(function (item) {
            sumOfSquaredDeviation += Math.pow(item.xAVG - populationMean, 2);
        });

        var standardDeviation =
            Math.sqrt(sumOfSquaredDeviation / populationCount);

        this.calc.stdDevs[this.calc.numberOfIterations].push({ key: "xAVG", value: standardDeviation });

        players.forEach(function (item) {
            var zScore = (item.xAVG - populationMean) / standardDeviation;
            item.zBa = zScore;
        });
    }

    Ops(players: battingInput[], item: statCategory) {

        // http://www.insidethebook.com/ee/index.php/site/comments/the_worth_of_sb_hr_and_all_other_categories_in_fantasy_baseball/

        var populationCount = this.input.numberOfPlayersDrafted;
        var thisGroup = players.slice(0, populationCount);

        // (AB * ( H + BB + HBP ) + TB * ( AB + BB + SF + HBP ))/(AB * ( AB + BB + SF + HBP))
        // 1. Calculate the population OPS
        var pAb = _.sumBy(thisGroup, 'ab');
        var pH = _.sumBy(thisGroup, 'h');
        var pBb = _.sumBy(thisGroup, 'bb');
        var pHbp = _.sumBy(thisGroup, 'hbp');

        var p_doubles = _.sumBy(thisGroup, 'd');
        var p_triples = _.sumBy(thisGroup, 't');
        var p_hr = _.sumBy(thisGroup, 'hr');

        var p_singles = pH - p_doubles - p_triples - p_hr;

        var pTb = p_singles + (2 * p_doubles) + (3 * p_triples) + (4 * p_hr);
        var pSf = _.sumBy(thisGroup, 'sf');
        var totalValue = 0;

        var populationOps = (pAb * (pH + pBb + pHbp) + pTb * (pAb + pBb + pSf + pHbp)) / (pAb * (pAb + pBb + pSf + pHbp));
        this.calc.xStatAverages[this.calc.numberOfIterations].push({ key: "OPS", value: populationOps });

        // 2. Calculate and set xOPS
        var counter = 0;
        var self = this;
        players.forEach(function (i) {
            // return input.ab + input.bb + input.hbp + input.sac + input.sf;
            let xOPS = i.pa * (i.ops - populationOps);
            i.xOPS = xOPS;
            if (counter < populationCount) {
                totalValue += xOPS;
            }

            counter++;
        });

        // 3. Calculate zScore of xOPS...
        var populationMean = totalValue / populationCount;
        this.calc.averages[this.calc.numberOfIterations].push({ key: "xOPS", value: populationMean });

        var sumOfSquaredDeviation = 0;
        thisGroup.forEach(function (item) {
            sumOfSquaredDeviation += Math.pow(item.xOPS - populationMean, 2);
        });

        var standardDeviation = Math.sqrt(sumOfSquaredDeviation / populationCount);

        this.calc.stdDevs[this.calc.numberOfIterations].push({ key: "xOPS", value: standardDeviation });

        players.forEach(function (item) {
            var zScore = (item.xOPS - populationMean) / standardDeviation;
            item.zOps = zScore;
        });
    }
}
