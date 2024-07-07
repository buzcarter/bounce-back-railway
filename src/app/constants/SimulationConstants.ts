/* eslint-disable key-spacing, no-multi-spaces */
import { milliseconds, velocity } from '../interfaces';
import { CLOCK_SPEED } from '../microcontroller';
import { TRAVEL_DISTANCE } from '../simulator/constants';

/** minimum time to completely travers the "Travel Distance" */
export const MIN_TIME_TO_COMPLETE: milliseconds      = 6000;
/** Time between Dashbord updates */
export const DASHBOARD_REFRESH_RATE: milliseconds    =  10 * CLOCK_SPEED;
/** Time required for a slow start/stop */
export const HALT_DURATION: milliseconds             = 1750;

/** (px/tick) */
export const MAX_SPEED: velocity = TRAVEL_DISTANCE / 400;
