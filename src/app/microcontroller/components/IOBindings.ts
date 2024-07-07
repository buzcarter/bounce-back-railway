// locals
// import { onPowerBtnClick } from './Power';
import * as Serial from './Serial';
// externals
import { uint8_t } from '../../interfaces';
import { PinAssignments } from '../../constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const pinMode = (pin: uint8_t, mode: uint8_t) => {
  switch (pin) {
    case PinAssignments.POWER_BTN:
      // setupBtn(pin, onPowerBtnClick);
      break;
    case PinAssignments.SPEED_CONTROL:
      // setupSlider(pin, 50.0);
      break;
    default:
      // setupBtn(pin);
  }
};

export const digitalWrite = (pin: uint8_t, value: uint8_t) => {
  Serial.println({ method: 'digitalWrite', pin, value });
};

export const analogWrite = (pin: uint8_t, value: uint8_t) => {
  Serial.println({ method: 'analogWrite', pin, value });
};

export const digitalRead = (pin: uint8_t) => {
  Serial.println({ method: 'digitalRead', pin });
  return 0;
};

export const analogRead = (pin: uint8_t) => {
  Serial.println({ method: 'analogRead', pin });
  return pin;// readValue(pin);
};
