import {playerInput} from './playerInput';

export interface pitchingInput extends playerInput{
    ab: number,
    h: number,
    d: number,
    t: number,
    hr: number,
    r: number,
    rbi: number,
    bb: number,
    hbp: number,
    sb: number,
    sf: number,
    a: number,
    sac: number,
    so: number
}