import { analogRead } from '../../app';
import { DIGITAL_LOW, uint8_t } from '../../common';

export const booleanRead = (pin: uint8_t) => analogRead(pin) > DIGITAL_LOW;
