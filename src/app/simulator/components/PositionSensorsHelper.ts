// externals
import { SIGNAL_CHBX } from '../../constants';
import { int, pixels } from '../../interfaces';
import { booleanRead } from '../../libs/mgrs/ControlManager';
// locals
import { CSSClasses, ElementIds } from '../constants';
import { getSignals } from './StationsHelper';
import { updateStdOut } from './StdOut';

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
          'Add Sensor': `${id}: ${name}`,
          at: position,
        });
      }
    });
};

const setActive = (id: int, isActive: boolean) => {
  document.getElementById(getSensorId(id))?.classList.toggle(CSSClasses.PROXIMITY_SENSOR_ACTIVE, isActive);
};

export const checkSensors = (left: pixels, right: pixels) => {
  const signals = getSignals();
  const index = signals.findIndex((sensor) => sensor.position >= left && sensor.position <= right);
  const sensor = index > -1 ? signals[index] : null;
  if (!sensor && currentSensorId > -1) {
    setActive(currentSensorId, false);
    if (booleanRead(SIGNAL_CHBX)) {
      updateStdOut({
        sensor: currentSensorId,
        state: 'off',
      });
    }
    currentSensorId = -1;
  } else if (sensor && sensor.id !== currentSensorId) {
    currentSensorId = sensor.id;
    setActive(currentSensorId, true);
    if (booleanRead(SIGNAL_CHBX)) {
      updateStdOut({
        sensor: sensor.id,
        state: 'on',
        name: sensor.name,
      });
    }
  }
  return sensor;
};
