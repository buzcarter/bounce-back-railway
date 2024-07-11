import { clockTick } from '../../common';

let ticks: clockTick = 0;

export const updateTicks = () => ticks++;

export const getTicks = () => ticks;

export const resetTicks = () => { ticks = 0; };
