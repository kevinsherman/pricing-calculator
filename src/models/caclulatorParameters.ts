import { PlayersInputParameters } from './playersInputParameters';
import * as c from '../common/constants';
import { statCategory } from './statCategory';
import { processCategories } from '../common/helpers';

export class CalculatorParameters {

    public numberOfTeams: number;
    public dollarsPerTeam: number;
    public minimumBid: number;
    public useCustomSplit: boolean;
    public hittersSplit: number;
    public pitchersSplit: number;
    public hittersInput: PlayersInputParameters;
    public pitchersInput: PlayersInputParameters;

    constructor(data: CalculatorParameters) {
        this.numberOfTeams = data.numberOfTeams;
        this.dollarsPerTeam = data.dollarsPerTeam;
        this.minimumBid = data.minimumBid;
        this.useCustomSplit = data.useCustomSplit;

        if (data.useCustomSplit) {
            this.hittersSplit = data.hittersSplit / 100;
            this.pitchersSplit = data.pitchersSplit / 100;
        }

        this.hittersInput = data.hittersInput;
        this.pitchersInput = data.pitchersInput

        this.hittersInput.statCategories = processCategories(data.hittersInput.categories, c.Batting);
        this.pitchersInput.statCategories = processCategories(data.pitchersInput.categories, c.Pitching);
    }
}                     