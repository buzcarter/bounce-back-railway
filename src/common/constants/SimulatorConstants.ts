/* eslint-disable key-spacing, no-multi-spaces */
import { pixels } from '../interfaces/CoreTypes';

export const ICON_SIZE: pixels                =   32;
export const STATION_SAFETY_LENGTH: pixels    =    8;
/** length of the entire track */
export const TRAVEL_DISTANCE: pixels          =  800;
export const MIN_LEFT_EDGE: pixels            = ICON_SIZE / 2;
export const MAX_RIGHT_EDGE: pixels           = TRAVEL_DISTANCE + (ICON_SIZE / 2);
export const INITIAL_TROLLEY_POSITION: pixels = 1 + ICON_SIZE / 2;

export const TROLLEY_LENGTH: pixels           =  ICON_SIZE;
