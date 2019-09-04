import { Calculator } from './standard_scores/calculator';
import { CalculatorParameters } from "./models/caclulatorParameters";
import { battingInput } from "./models/battingInput";
import { pitchingInput } from "./models/pitchingInput";
import { CalculatorResponse } from "./models/calculatorResponse";
import * as h from './common/helpers';
import * as c from './common/constants';
import * as _ from 'lodash';

export class PriceCalculator {

    private parameters: CalculatorParameters;
    private batters: battingInput[];
    private pitchers: pitchingInput[];
    private response: CalculatorResponse;



    constructor(calculatorParameters: CalculatorParameters,
        battingInputs: battingInput[],
        pitchingInputs: pitchingInput[]) {

        this.parameters = new CalculatorParameters(calculatorParameters);
        this.batters = h.processPlayers(this.parameters, battingInputs, c.Batting) as battingInput[];
        this.pitchers = h.processPlayers(this.parameters, pitchingInputs, c.Pitching) as pitchingInput[];
        this.response = new CalculatorResponse();
    }

    calculate(): CalculatorResponse {

        this.calculateZScores();
        this.calculatePricing();

        return this.response;
    }

    private calculateZScores() {
        this.response.battersOutput = new Calculator(this.batters, this.parameters, c.Batting).calculate();
        this.response.pitchersOutput = new Calculator(this.pitchers, this.parameters, c.Pitching).calculate();
    }

    private calculatePricing() {

        var self = this;

        var draftBudget = this.parameters.dollarsPerTeam * this.parameters.numberOfTeams;
        var totalNumberOfPlayers = this.parameters.hittersInput.numberOfPlayersDrafted +
            this.parameters.pitchersInput.numberOfPlayersDrafted;

        var marginalBatters = this.parameters.hittersInput.numberOfPlayersDrafted * this.parameters.minimumBid;
        var marginalPitchers = this.parameters.pitchersInput.numberOfPlayersDrafted * this.parameters.minimumBid

        this.batters = _.orderBy(this.batters, (player) => player.adjTotal, ['desc']);
        this.pitchers = _.orderBy(this.pitchers, (pitcher) => pitcher.adjTotal, ['desc']);

        var totalBattingPoints = _(this.batters).filter(x => x.isAboveReplacement).sumBy(x => x.adjTotal);
        var totalPitchingPoints = _(this.pitchers).filter(x => x.isAboveReplacement).sumBy(x => x.adjTotal);

        var pointsDenominator = totalBattingPoints + totalPitchingPoints;
        var battingDollars: number;
        var pitchingDollars: number;
        var battingRatio: number;
        var pitchingRatio: number;

        if (this.parameters.useCustomSplit) {
            battingRatio = this.parameters.hittersSplit;
            pitchingRatio = this.parameters.pitchersSplit;
        } else {
            battingRatio = totalBattingPoints / pointsDenominator;
            pitchingRatio = totalPitchingPoints / pointsDenominator;
        }

        battingDollars = battingRatio * draftBudget - marginalBatters;
        pitchingDollars = pitchingRatio * draftBudget - marginalPitchers;

        this.batters.filter(x => x.isAboveReplacement).forEach(function (p) {
            var points = p.adjTotal;
            p.dollarValue = (points / totalBattingPoints) * battingDollars + 1;
            points = -p.adjustment;
            p.pos_Sal = (points / totalBattingPoints) * battingDollars;

            self.parameters.hittersInput.statCategories.forEach(cat => {
                points = p[cat.zScoreName];
                p[cat.name + "_sal"] = (points / totalBattingPoints) * battingDollars;
            });
        });

        this.response.hitters = this.batters;
        this.response.battingRatio = battingRatio;
        this.response.pitchingRatio = pitchingRatio;

        this.pitchers.forEach(function (p) {
            var points = p.adjTotal;
            p.dollarValue = (points / totalPitchingPoints) * pitchingDollars + 1;
            points = -p.adjustment;
            p.pos_Sal = (points / totalPitchingPoints) * pitchingDollars;

            self.parameters.pitchersInput.statCategories.forEach(cat => {
                points = p[cat.zScoreName];
                p[cat.name + "_sal"] = (points / totalPitchingPoints) * pitchingDollars;
            });
        });

        this.response.pitchers = this.pitchers;
    }
}
