/* eslint-disable key-spacing, no-multi-spaces */
import { milliseconds, pixels } from "../interfaces/CoreTypes";

/** (ms/tick) i.e. tick duration */
export const CLOCK_SPEED: milliseconds               = 5;
/** minimum time to completely travers the "Travel Distance" */
export const MIN_TIME_TO_COMPLETE: milliseconds      = 6000;
/** Time between Dashbord updates */
export const DASHBOARD_REFRESH_RATE: milliseconds    =  100;
/** Time required for a slow start/stop */
export const HALT_DURATION: milliseconds             = 1750;
/** length of the entire track */
export const TRAVEL_DISTANCE: pixels                 =  800;
