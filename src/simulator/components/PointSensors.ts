// External
import {
  getStations,
  IR_SENSOR__CLEAR, IR_SENSOR__BLOCKED,
  STATION_SAFETY_LENGTH,
  pixels,
} from '../../common';
import { analogWrite } from '../../microcontroller';
// locals
import { updateStationUI } from './StationsHelper';

let currentSensorId = -1;

export const getStationByPostion = (pos: pixels) => getStations()
  .find((station: { position: pixels}) => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

export const tripSensors = (position: pixels): void => {
  const station = getStationByPostion(position);
  if (station && station.id !== currentSensorId) {
    analogWrite(station.id, IR_SENSOR__BLOCKED);
    updateStationUI(station.id, true);
    currentSensorId = station.id;
  } else if (!station && currentSensorId > -1) {
    analogWrite(currentSensorId, IR_SENSOR__CLEAR);
    updateStationUI(currentSensorId, false);
    currentSensorId = -1;
  }
};
