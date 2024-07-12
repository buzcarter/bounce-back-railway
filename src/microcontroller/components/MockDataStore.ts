import { uint10_MAX, uint10_t, uint8_t } from '../../common';

interface DataStoreObj {
  [key: string]: uint10_t,
}

const dataCache: DataStoreObj = {};

// const getPin = (pin: uint8_t): string => `A${pin}`;

const getPin = (pin: uint8_t): uint8_t => {
  if (pin < 0 || pin > 255) {
    throw new Error(`analogWrite: Invalid value: ${pin}`);
  }
  return pin;
};

/**
 * @protected
 */
export const set = (pin: uint8_t, value: uint10_t) => {
  if (value < 0 || value > uint10_MAX) {
    throw new Error(`analogWrite: Invalid value: ${value} on pin ${pin}`);
  }
  dataCache[getPin(pin)] = value;
};

/**
 * @protected
 */
export const get = (pin: uint8_t): uint10_t => dataCache[getPin(pin)];
