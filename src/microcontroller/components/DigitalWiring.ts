/* eslint-disable @typescript-eslint/no-unused-vars */
import { int, uint8_t } from '../../common';
// locals
import * as DataStore from './MockDataStore';

export const digitalRead = (pin: uint8_t): int => DataStore.get(pin);

export const digitalWrite = (pin: uint8_t, val: int): void => {
  DataStore.set(pin, val);
};
