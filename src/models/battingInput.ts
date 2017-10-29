import {playerInput} from './playerInput';

export interface battingInput extends playerInput{
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
    so: number,
    g_c: number,
    g_1B: number,
    g_2B: number,
    g_3B: number,
    g_ss: number,
    g_lf: number,
    g_cf: number,
    g_rf: number,
    g_of: number
}