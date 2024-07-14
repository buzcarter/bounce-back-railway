import { analogWrite } from '../../../microcontroller';
import {
  int,
  uint10_t,
  uint8_t,
  HIGH_LOW_THRESHOLD,
  OutputModes,
  DigitalLevels,
} from '../../../common';
import { analogRead } from '../../../microcontroller';

const { LOW, HIGH } = DigitalLevels;

interface CurrentStateObj {
  pin: uint8_t,
  value: uint10_t,
  hasChanged: boolean,
}

const currentStates: CurrentStateObj[] = [];

const getDirtyObject = (pin: uint8_t) => currentStates.find((t) => t.pin === pin);

const updateValue = (pin: uint8_t, value: int): int => {
  const obj = getDirtyObject(pin);
  if (!obj) {
    return value;
  }

  if (obj.value !== value) {
    obj.value = value;
    obj.hasChanged = true;
  } else {
    obj.hasChanged = false;
  }
  analogWrite(pin, value);
  return value;
};

/** Reads the pin's change/dirty flag */
export const hasInputChanged = (pin: uint8_t): boolean => getDirtyObject(pin)?.hasChanged ?? false;

export const pollInputs = () => {
  currentStates.forEach((obj) => {
    const newVal = analogRead(obj.pin);
    const state = currentStates.find((t) => t.pin === obj.pin);
    if (state && state.value !== newVal) {
      // throw new Error('state.value !== newVal');
      state.hasChanged = true;
      state.value = newVal;
    }
  });
};

/**  */
export const resetChangeFlags = () => {
  currentStates.forEach((obj) => {
    // eslint-disable-next-line no-param-reassign
    obj.hasChanged = false;
  });
};

/** Set to between 0 and 1023 */
export const setAnalogValue = (pin: uint8_t, value: uint10_t) => {
  updateValue(pin, value);
};

/**  */
export const booleanRead = (pin: uint8_t): boolean => analogRead(pin) > HIGH_LOW_THRESHOLD;

/**  */
export const booleanToggle = (pin: uint8_t): boolean => {
  const isTrue = analogRead(pin) > HIGH_LOW_THRESHOLD;
  const newVal = !isTrue ? HIGH : LOW;
  analogWrite(pin, newVal);
  updateValue(pin, newVal);
  return newVal > HIGH_LOW_THRESHOLD;
};

export const booleanWrite = (pin: uint8_t, isTrue: boolean) => {
  const newVal = isTrue ? HIGH : LOW;
  analogWrite(pin, newVal);
  updateValue(pin, newVal);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ctlPinMode = (pin: uint8_t, mode: OutputModes) => {
  currentStates.push({
    pin,
    value: LOW,
    hasChanged: false,
    // mode: mode === OutputModes.OUTPUT ? 'output' : 'input',
  });
};
