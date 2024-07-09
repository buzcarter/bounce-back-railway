/* eslint-disable no-multi-spaces */
import { uint10_t, uint8_t } from '../interfaces';
import {
  LED_BUILTIN, PIN_A0, PIN_A1, PIN_A2, PIN_A3, PIN_A4, PIN_A5, PWM_5,
} from '../microcontroller';

// Motor Driver Pins
export const MOTOR_REVERSE_OUT: uint10_t    = 3; // to L298N_IN2
export const MOTOR_FORWARD_OUT: uint10_t    = 4; // to L298N_IN1
export const MOTOR_SPEED_OUT: uint10_t      = PWM_5; // to L298N_ENA

// Sensor Pins
export const SENSOR_LT_LA: uint10_t            = PIN_A0;
export const SENSOR_RT_CLAREMONT: uint10_t     = PIN_A1;
export const SENSOR_MIDDLE_BURBANK: uint10_t   = PIN_A2;
export const SENSOR_ATWATER_XING: uint10_t     = PIN_A3;
export const SENSOR_SOUTH_GATE_XING: uint10_t  = PIN_A4;
export const SENSOR_26TH_AVE_XING: uint10_t    = PIN_A5;

// B.S. Pins
export const HALT_BTN: uint8_t              = 100;
export const PAUSE_BTN: uint8_t             = 101;
export const POWER_BTN: uint8_t             = 102;
export const REVERSE_BTN: uint8_t           = 103;

export const SPEED_CONTROL: uint8_t         = 104;

export const CONTROL_PANEL_CHBX: uint8_t    = 108;
export const DASHBORD_CHBX: uint8_t         = 105;
export const SIGNAL_CHBX: uint8_t           = 106;
export const STATION_CHBX: uint8_t          = 107;

// LED Output Pins
export const CLOCK_LED_OUT: uint10_t        = LED_BUILTIN;
