import positionSensors from '../../configs/Sensors';
import { ids } from '../../constants';
import { CSSClasses } from '../../enums';
import { int, pixels } from '../../interfaces';
import { getTicks } from '../System/Clock';
import { updateStdOut } from './StdOut';

let currentSensorId = -1;

const getSensorId = (id: int) => `sensor-${id}`;

export const addPositionSensors = () => {
  const railEle = document.getElementById(ids.RAIL);
  if (!railEle) {
    return;
  }

  positionSensors.forEach(({ id, name, position }) => {
    const sensorEle = document.createElement('span');
    sensorEle.classList.add(CSSClasses.PROXIMITY_SENSOR);
    sensorEle.title = name;
    sensorEle.style.left = `${position}px`;
    sensorEle.id = getSensorId(id);
    sensorEle.title = name;

    railEle.appendChild(sensorEle);
    updateStdOut({
      'Add Sensor': `${id}: {$name}`,
      at: position,
    });
  });
}

const setActive = (id: int, isActive: boolean) => {
  document.getElementById(getSensorId(id))?.classList.toggle(CSSClasses.PROXIMITY_SENSOR_ACTIVE, isActive);
}

export const checkSensors = (left: pixels, right: pixels) => {
  const index = positionSensors.findIndex(sensor => sensor.position >= left && sensor.position <= right);
  const sensor = index > -1 ? positionSensors[index] : null;
  if (!sensor && currentSensorId > -1) {
    setActive(currentSensorId, false);
    updateStdOut({
      'sensor': currentSensorId,
      'state': 'off',
      ticks: getTicks(),
    });
    currentSensorId = -1;
  } else if (sensor && sensor.id !== currentSensorId) {
    currentSensorId = sensor.id;
    setActive(currentSensorId, true);
    updateStdOut({
      'sensor': sensor.id,
      'state': 'on',
      'name': sensor.name,
      ticks: getTicks(),
    });
  }
  return sensor;
}
