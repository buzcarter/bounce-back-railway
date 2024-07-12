// External
import {
  getStations,
  SENSOR_VOLTS_ALL_CLEAR, SENSOR_VOLTS_OBJECT_DETECTED,
  STATION_SAFETY_LENGTH,
  pixels,
} from '../../common';
import { analogWrite } from '../../microcontroller';
// locals
import { setActive } from './StationsHelper';

let currentSensorId = -1;

export const getStationByPostion = (pos: pixels) => getStations()
  .find((station: { position: pixels}) => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

export const tripSensors = (position: pixels): void => {
  const station = getStationByPostion(position);
  if (station && station.id !== currentSensorId) {
    analogWrite(station.id, SENSOR_VOLTS_OBJECT_DETECTED);
    setActive(station.id, true);
    currentSensorId = station.id;
  } else if (!station && currentSensorId > -1) {
    analogWrite(currentSensorId, SENSOR_VOLTS_ALL_CLEAR);
    setActive(currentSensorId, false);
    currentSensorId = -1;
  }
};
