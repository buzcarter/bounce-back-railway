// externals
import {
  getSignals, SIGNAL_CHBX, int, pixels, IR_SENSOR__BLOCKED, IR_SENSOR__CLEAR,
} from '../../common';
import { analogWrite } from '../../microcontroller';
// locals
import { CSSClasses, ElementIds } from '../constants';
import { updateStdOut } from './StdOut';
import { booleanRead } from './Utils';

let currentSensorId = -1;

const getSensorId = (id: int) => `sensor-${id}`;

export const addSensorsToRail = () => {
  const railEle = document.getElementById(ElementIds.RAIL);
  if (!railEle) {
    return;
  }

  getSignals()
    .forEach(({ id, name, position }) => {
      const sensorEle = document.createElement('span');
      sensorEle.classList.add(CSSClasses.PROXIMITY_SENSOR);
      sensorEle.title = name;
      sensorEle.style.left = `${position}px`;
      sensorEle.id = getSensorId(id);
      sensorEle.title = name;

      railEle.appendChild(sensorEle);
      if (booleanRead(SIGNAL_CHBX)) {
        updateStdOut({
          pin: id,
          'add sensor': name,
          at: position,
        });
      }
    });
};

const updateSensorUI = (id: int, isActive: boolean) => {
  document.getElementById(getSensorId(id))?.classList.toggle(CSSClasses.PROXIMITY_SENSOR_ACTIVE, isActive);
};

export const tripSensors = (left: pixels, right: pixels) => {
  const signals = getSignals();
  const index = signals.findIndex((sensor) => sensor.position >= left && sensor.position <= right);
  const sensor = index > -1 ? signals[index] : null;
  if (!sensor && currentSensorId > -1) {
    updateSensorUI(currentSensorId, false);
    analogWrite(currentSensorId, IR_SENSOR__CLEAR);
    if (booleanRead(SIGNAL_CHBX)) {
      updateStdOut({
        pin: currentSensorId,
        state: 'off',
      });
    }
    currentSensorId = -1;
  } else if (sensor && sensor.id !== currentSensorId) {
    currentSensorId = sensor.id;
    updateSensorUI(currentSensorId, true);
    analogWrite(currentSensorId, IR_SENSOR__BLOCKED);
    if (booleanRead(SIGNAL_CHBX)) {
      updateStdOut({
        pin: sensor.id,
        state: 'on',
        name: sensor.name,
      });
    }
  }
  return sensor;
};
