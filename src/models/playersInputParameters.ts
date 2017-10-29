import { KeyValuePair } from '../common/helpers';
import { statCategory } from './statCategory';

export interface PlayersInputParameters {
    categories: string[],
    statCategories: statCategory[],
    positions: KeyValuePair[],
    minGames: KeyValuePair[],
    numberOfPlayersDrafted: number
}