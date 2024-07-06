import { SENSOR_THRESHOLD } from '../../constants';
import { uint8_t } from '../../interfaces';
import { analogRead } from '../Components/IRSensor';
import { updateStdOut } from '../Simulator';

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
