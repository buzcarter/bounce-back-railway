import positionSensors from '../PositionSensorsSetup';
import { ids } from '../constants';
import { CSSClasses } from '../enums';
import { pixels } from '../interfaces';
import { getTicks } from '../libs/System/Clock';
import { updateStdOut } from './StdOut';

let currentSensorIndex = -1;

export const addPositionSensors = () => {
  const railEle = document.getElementById(ids.RAIL);
  if (!railEle) {
    return;
  }

  positionSensors.forEach(({ position, name}) => {
    const sensorEle = document.createElement('span');
    sensorEle.classList.add(CSSClasses.BOUNDARY_SENSOR);
    sensorEle.title = name;
    sensorEle.style.left = `${position}px`;
    sensorEle.dataset.position = position.toString();
    sensorEle.title = name;

    railEle.appendChild(sensorEle);
    updateStdOut({
      'Added Sensor': name,
      at: position,
    });
  });
}

export const checkSensors = (left: pixels, right: pixels) => {
  const index = positionSensors.findIndex(sensor => sensor.position >= left && sensor.position <= right);
  if (index < 0 && currentSensorIndex > -1) {
    currentSensorIndex = -1;
  } else if (index > -1 && index !== currentSensorIndex) {
    currentSensorIndex = index;
    const sensor = positionSensors[index];
    updateStdOut({
      'Sensor Triggered': sensor.name,
      ticks: getTicks(),
    });
    return sensor;
  }
  return null;
}
