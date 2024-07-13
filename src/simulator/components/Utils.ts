import { analogRead } from '../../app';
import { LOW, uint8_t } from '../../common';

export const booleanRead = (pin: uint8_t) => analogRead(pin) > LOW;
