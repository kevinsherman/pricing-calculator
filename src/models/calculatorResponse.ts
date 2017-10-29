import {PlayersOutput} from './playersOutput';
import {battingInput} from './battingInput';
import {pitchingInput} from './pitchingInput';

export class CalculatorResponse
{
   public battersOutput: PlayersOutput;
   public pitchersOutput: PlayersOutput;
   public hitters: battingInput[];
   public pitchers: pitchingInput[];

   constructor()
   {
       this.battersOutput = new PlayersOutput();
       this.pitchersOutput = new PlayersOutput();
   }
}