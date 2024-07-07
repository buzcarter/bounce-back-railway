import { analogRead } from '../../components/IRSensor';
import { uint8_t } from '../../interfaces';
import { SENSOR_THRESHOLD } from '../../microcontroller/constants/ArduinoUno';
import { updateStdOut } from '../../simulator/components/StdOut';

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

export enum StationTransistions {
  ARRIVAL = 1,
  DEPARTURE = 2,
  NO_CHANGE = 0,
}

export const checkStations = () => {};

export const getCurrentStationId = () => null;

export const getCurrentStation = () => null;
