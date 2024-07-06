import { clockTick } from '../../interfaces';

let ticks: clockTick = 0;

export const updateTicks = () => ticks++;

export const getTicks = () => ticks;

export const resetTicks = () => { ticks = 0; };
