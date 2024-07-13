import { analogWrite } from '../../../microcontroller';
import {
  int,
  uint10_t,
  uint8_t,
  CONTROL_PANEL_CHBX,
  HIGH_LOW_THRESHOLD,
  HIGH,
  LOW,
} from '../../../common';
import { Serial } from '../../../microcontroller';
import { analogRead } from '../../../microcontroller';

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

  // eslint-disable-next-line no-use-before-define
  if (booleanRead(CONTROL_PANEL_CHBX)) {
    Serial.println({
      pin,
      value: value as number,
      // name: obj.name,
    });
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
  return newVal > HIGH_LOW_THRESHOLD;
};

export const booleanWrite = (pin: uint8_t, value: boolean) => {
  updateValue(pin, value ? HIGH : LOW);
};
