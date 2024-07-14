import { int, uint10_MAX, uint8_t } from '../../common';
// locals
import * as DataStore from './MockDataStore';
import * as Serial from './Serial';

export const analogRead = (pin: uint8_t): int => DataStore.get(pin);

export const analogWrite = (pin: uint8_t, val: int): void => {
  if (val < 0 || val > uint10_MAX) {
    Serial.println({ error: 'Value out of range (uint10_t between 0 - 1023)', pin, val });
    throw new Error(`analogWrite: Invalid value: ${val} (pin ${pin})`);
  }
  DataStore.set(pin, val);
};
