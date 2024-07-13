import {
  milliseconds, velocity, uint10_t,
  uint8_t,
} from '../interfaces/CoreTypes';
import { OFF, ON } from './ArduinoUno';
import { CLOCK_SPEED } from './MicrocontrollerConstants';
import { TRAVEL_DISTANCE } from './SimulatorConstants';

/* eslint-disable key-spacing, no-multi-spaces */
export const uint10_MAX: uint10_t                    = 1023;
export const uint8_MAX: uint8_t                      =  255;

/** Cutoff for IR proximity filter, 0 - 1023 */
export const IR_SENSOR__BLOCKED: uint10_t            =   ON; // using ON/OFF for now (believe the real sensor value for "blocked" is 500? verify. OFF is 64?)
export const IR_SENSOR__CLEAR: uint10_t              =  OFF; // example "OFF" value, (unobstructed) there's nothing reflecting light back to the sensor

/* eslint-disable key-spacing, no-multi-spaces */
/** minimum time to completely travers the "Travel Distance" */
export const MIN_TIME_TO_COMPLETE: milliseconds      = 6000;
/** Time between Dashbord updates */
export const DASHBOARD_REFRESH_RATE: milliseconds    = 10 * CLOCK_SPEED;
/** Time required for a slow start/stop */
export const HALT_DURATION: milliseconds             = 1750;

/** (px/tick) */
export const MAX_SPEED: velocity                     = TRAVEL_DISTANCE / 400;
