import { uint8_t } from '../../common';

export const isDigital = (pin: uint8_t): boolean => pin < 14;
export const isAnalog = (pin: uint8_t): boolean => pin >= 14;
