/* eslint-disable no-multi-spaces */
import { uint8_t, volts } from '../interfaces/CoreTypes';

// #region Analog Pins
/*
 * Arduino Uno has 6-ish analog pins (A0-A5), which utilize ADC (Analog to Digital converter)
 * The ADC has 10-bit resolution, meaning it can represent analog voltage by 1,024 digital levels.
 */

export const PIN_A0: uint8_t   = 14;
export const PIN_A1: uint8_t   = 15;
export const PIN_A2: uint8_t   = 16;
export const PIN_A3: uint8_t   = 17;
export const PIN_A4: uint8_t   = 18;
export const PIN_A5: uint8_t   = 19;
export const PIN_A6: uint8_t   = 20;
export const PIN_A7: uint8_t   = 21;

export const A0: uint8_t       = PIN_A0;
export const A1: uint8_t       = PIN_A1;
export const A2: uint8_t       = PIN_A2;
export const A3: uint8_t       = PIN_A3;
export const A4: uint8_t       = PIN_A4;
export const A5: uint8_t       = PIN_A5;
export const A6: uint8_t       = PIN_A6;
export const A7: uint8_t       = PIN_A7;

// Pins 0-13 serve as digital input/output pins.
export const PIN_D0: uint8_t   =  0;
export const PIN_D1: uint8_t   =  1;
export const PIN_D2: uint8_t   =  2;
export const PIN_D3: uint8_t   =  3;
export const PIN_D4: uint8_t   =  4;
export const PIN_D5: uint8_t   =  5;
export const PIN_D6: uint8_t   =  6;
export const PIN_D7: uint8_t   =  7;
export const PIN_D8: uint8_t   =  8;
export const PIN_D9: uint8_t   =  9;
export const PIN_D10: uint8_t  = 10;
export const PIN_D11: uint8_t  = 11;
export const PIN_D12: uint8_t  = 12;
export const PIN_D13: uint8_t  = 13;

// Pin 13 is connected to the built-in LED.
export const LED_BUILTIN: uint8_t  = PIN_D13;

// Pins 3,5,6,9,10,11 have PWM capability.
export const PWM_3: uint8_t    = PIN_D3;
export const PWM_5: uint8_t    = PIN_D5;
export const PWM_6: uint8_t    = PIN_D6;
export const PWM_9: uint8_t    = PIN_D9;
export const PWM_10: uint8_t   = PIN_D10;
export const PWM_11: uint8_t   = PIN_D11;

export enum DigitalLevels {
  /** Below 0.8v is considered OFF */
  LOW   = 0.1,
  /** Above 2.0v is considred ON */
  HIGH  = 4.7,
}

export const HIGH_LOW_THRESHOLD: volts =  DigitalLevels.LOW + (DigitalLevels.HIGH - DigitalLevels.LOW) / 2;

export enum BinaryStates {
  ON    = DigitalLevels.HIGH,
  OFF   = DigitalLevels.LOW,
}

export enum OutputModes {
  OUTPUT  = 1,
  INPUT   = 0,
}

export const MAX_VOLTs: volts  = 5.0;

export const digitalPinHasPWM = (pin: uint8_t): boolean => (
  (pin) === PWM_3
  || (pin) === PWM_5
  || (pin) === PWM_6
  || (pin) === PWM_9
  || (pin) === PWM_10
  || (pin) === PWM_11
);
