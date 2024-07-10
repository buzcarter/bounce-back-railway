// External
import { SENSOR_VOLTS_ALL_CLEAR, SENSOR_VOLTS_OBJECT_DETECTED, SENSOR_VOLTS_THRESHOLD } from '../../constants';
import { pixels, uint8_t } from '../../interfaces';
import { analogRead, analogWrite } from '../../libs/mgrs/ControlManager';
import { StationTransistions } from '../../libs/mgrs/StationManager';
// locals
import { getStationByPostion, getStations } from './StationsHelper';

let currentSensorId = -1;

export const tripSensors = (position: pixels): void => {
  const station = getStationByPostion(position);
  if (station && station.id !== currentSensorId) {
    analogWrite(station.id, SENSOR_VOLTS_OBJECT_DETECTED);
    currentSensorId = station.id;
  } else if (!station && currentSensorId > -1) {
    analogWrite(currentSensorId, SENSOR_VOLTS_ALL_CLEAR);
    currentSensorId = -1;
  }
};

export const pollSensors = () => null;

export const clearSensors = () => null;

export const getCurrentSensor = (): uint8_t | null => {
  const station = getStations().find(({ id }) => analogRead(id) > SENSOR_VOLTS_THRESHOLD);
  return station?.id ?? null;
};

export const resetCurrentSensor = () => null;

export const getStationTransistions = () => StationTransistions.NO_CHANGE;
