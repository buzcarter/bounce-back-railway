import { uint10_t, volts } from '../../interfaces';

// #region Analog Pins
/*
 * Arduino Uno has 6 analog pins (A0-A5), which utilize ADC (Analog to Digital converter)
 * The ADC has 10-bit resolution, meaning it can represent analog voltage by 1,024 digital levels.
 */
export const PIN_A0: uint10_t = 0;
export const PIN_A1: uint10_t = 1;
export const PIN_A2: uint10_t = 2;
export const PIN_A3: uint10_t = 3;
export const PIN_A4: uint10_t = 4;
export const PIN_A5: uint10_t = 5;
// export const PIN_A6: uint10_t  = 6;
// export const PIN_A7: uint10_t  = 7;

export const A0: uint10_t = PIN_A0;
export const A1: uint10_t = PIN_A1;
export const A2: uint10_t = PIN_A2;
export const A3: uint10_t = PIN_A3;
export const A4: uint10_t = PIN_A4;
export const A5: uint10_t = PIN_A5;
// export const A6:  uint10_t = PIN_A6;
// export const A7:  uint10_t = PIN_A7;
// #endregion

// #region Digital Pins
// Pins 0-13 serve as digital input/output pins.
export const PIN_D0: uint10_t = 0;
export const PIN_D1: uint10_t = 1;
export const PIN_D2: uint10_t = 2;
export const PIN_D3: uint10_t = 3;
export const PIN_D4: uint10_t = 4;
export const PIN_D5: uint10_t = 5;
export const PIN_D6: uint10_t = 6;
export const PIN_D7: uint10_t = 7;
export const PIN_D8: uint10_t = 8;
export const PIN_D9: uint10_t = 9;
export const PIN_D10: uint10_t = 10;
export const PIN_D11: uint10_t = 11;
export const PIN_D12: uint10_t = 12;
export const PIN_D13: uint10_t = 13;

// Pin 13 is connected to the built-in LED.
export const LED_BUILTIN: uint10_t = PIN_D13;

// Pins 3,5,6,9,10,11 have PWM capability.
export const PWM_3: uint10_t = PIN_D3;
export const PWM_5: uint10_t = PIN_D5;
export const PWM_6: uint10_t = PIN_D6;
export const PWM_9: uint10_t = PIN_D9;
export const PWM_10: uint10_t = PIN_D10;
export const PWM_11: uint10_t = PIN_D11;

// #endregion

/** Cutoff for IR proximity filter, 0 - 1023 */
export const SENSOR_THRESHOLD: uint10_t = 500;

/** Below 0.8v is considered OFF */
export const DIGITAL_LOW: volts = 0.8;
/** Above 2.0v is considred ON */
export const DIGITAL_HIGH: volts = 2.0;
