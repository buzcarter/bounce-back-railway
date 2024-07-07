import { uint8_t } from '../../interfaces';
import { SENSOR_THRESHOLD } from '../../microcontroller/constants/ArduinoUno';
import { updateStdOut } from '../../simulator/components/StdOut';
import { analogRead } from '../Componentz/IRSensor';

let lastStation: uint8_t = 0;

export const isAtStation = (pin: uint8_t): boolean => {
  const atStation = analogRead(pin) < SENSOR_THRESHOLD;
  if (atStation && lastStation === pin) {
    return false;
  }

  if (atStation) {
    lastStation = pin;
    updateStdOut({
      message: 'Arrived at station',
      pin,
    });
  }

  return atStation;
};
