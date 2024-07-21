import { CLOCK_SPEED, clockTick } from '../../common';

let ticks: clockTick = 0;

export const updateTicks = () => ticks++;

export const getTicks = () => ticks;

export const resetTicks = () => { ticks = 0; };

export const millis = () => ticks * CLOCK_SPEED;
