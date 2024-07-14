import { DigitalLevels, int, uint8_t } from '../../common';
// locals
import * as DataStore from './MockDataStore';
import * as Serial from './Serial';

const { LOW, HIGH } = DigitalLevels;

export const digitalRead = (pin: uint8_t): DigitalLevels => DataStore.get(pin);

export const digitalWrite = (pin: uint8_t, val: DigitalLevels): void => {
  if (val !== LOW && val !== HIGH) {
    Serial.println({ error: 'Value out of range (expected LOW or HIGH)', pin, val });
    throw new Error(`digitalWrite: Invalid value: ${val} (pin ${pin})`);
  }
  DataStore.set(pin, val);
};
