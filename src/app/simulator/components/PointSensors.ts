// External
import { SENSOR_VOLTS_ALL_CLEAR, SENSOR_VOLTS_OBJECT_DETECTED } from '../../constants';
import { pixels } from '../../interfaces';
import { analogWrite } from '../../libs/mgrs/ControlManager';
// locals
import { getStationByPostion, setActive } from './StationsHelper';

let currentSensorId = -1;

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
