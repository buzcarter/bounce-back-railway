import { stations } from '../../configs/Stations';
import { SENSOR_VOLTS_THRESHOLD, SensorTypes } from '../../constants';
import { uint8_t } from '../../interfaces';
import { analogRead } from './ControlManager';

export enum StationTransistions {
  ARRIVAL = 1,
  DEPARTURE = 2,
  NO_CHANGE = 0,
}

let currentStation: uint8_t = -1;

const getByType = (filterType: SensorTypes) => stations.filter(({ type }: { type: SensorTypes}) => type === filterType);

/**
 * Check if the train has *arrived* at a station by reading the IR proximity
 * sensor (corresponding to `pin`) and comparing it to the threshold.
 * After returning `true` for a given station this will not return `true` again
 * until after the train has visited a different station.
 */
const checkStation = (pin: uint8_t): boolean => {
  const isAtStation = analogRead(pin) > SENSOR_VOLTS_THRESHOLD;
  if (isAtStation && currentStation === pin) {
    return false;
  }
  if (isAtStation) {
    currentStation = pin;
    // Serial.println({ arrived: pin });
  }
  return isAtStation;
};

export const checkAllSensors = () => {
  getByType(SensorTypes.STATION).forEach(({ id }) => {
    checkStation(id);
  });
};

export const getCurrentStationSensor = () => currentStation;
