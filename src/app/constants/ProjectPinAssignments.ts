import { uint10_t } from '../interfaces';
import { LED_BUILTIN, PWM_5 } from '../microcontroller/constants/ArduinoUno';

// Motor Driver Pins
export const MOTOR_REVERSE_OUT: uint10_t = 3; // to L298N_IN2
export const MOTOR_FORWARD_OUT: uint10_t = 4; // to L298N_IN1
export const MOTOR_SPEED_OUT: uint10_t = PWM_5; // to L298N_ENA

// LED Output Pins
export const CLOCK_LED_OUT: uint10_t = LED_BUILTIN;
