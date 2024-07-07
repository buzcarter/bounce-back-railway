/* eslint-disable key-spacing, no-multi-spaces */
import { milliseconds, pixels, velocity } from '../interfaces';
import { CLOCK_SPEED } from '../microcontroller';

// #region Timing/Speed contraints
/** minimum time to completely travers the "Travel Distance" */
export const MIN_TIME_TO_COMPLETE: milliseconds      = 6000;
/** Time between Dashbord updates */
export const DASHBOARD_REFRESH_RATE: milliseconds    =  10 * CLOCK_SPEED;
/** Time required for a slow start/stop */
export const HALT_DURATION: milliseconds             = 1750;
// #endregion

// #region Define limits on available track space
export const ICON_SIZE: pixels                =   32;
export const STATION_SAFETY_LENGTH: pixels    =    8;
/** length of the entire track */
export const TRAVEL_DISTANCE: pixels          =  800;
export const MIN_LEFT_EDGE: pixels            = ICON_SIZE / 2;
export const MAX_RIGHT_EDGE: pixels           = TRAVEL_DISTANCE + (ICON_SIZE / 2);
export const INITIAL_TROLLEY_POSITION: pixels = 1 + ICON_SIZE / 2;
// #endregion

/** (px/tick) */
export const MAX_SPEED: velocity = TRAVEL_DISTANCE / 400;
