import { HIGH_LOW_THRESHOLD, uint8_t } from '../../common';
import { analogRead } from '../../microcontroller';

export const booleanRead = (pin: uint8_t) => analogRead(pin) > HIGH_LOW_THRESHOLD;
