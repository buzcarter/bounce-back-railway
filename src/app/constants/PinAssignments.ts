import { uint10_t, uint8_t } from '../interfaces';
import { LED_BUILTIN, PWM_5 } from '../microcontroller';

/* eslint-disable no-multi-spaces */
// Motor Driver Pins
export const MOTOR_REVERSE_OUT: uint10_t    = 3; // to L298N_IN2
export const MOTOR_FORWARD_OUT: uint10_t    = 4; // to L298N_IN1
export const MOTOR_SPEED_OUT: uint10_t      = PWM_5; // to L298N_ENA

// B.S. Pins
export const PAUSE_BTN: uint8_t             = 100;
export const HALT_BTN: uint8_t              = 101;
export const POWER_BTN: uint8_t             = 102;
export const REVERSE_BTN: uint8_t           = 103;
export const SPEED_CONTROL: uint8_t         = 104;

// LED Output Pins
export const CLOCK_LED_OUT: uint10_t = LED_BUILTIN;
