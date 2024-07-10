// externals
import { getState } from '../../main';
import { booleanRead } from '../../libs/mgrs/ControlManager';
import { PAUSE_BTN, POWER_BTN } from '../../constants';
// locals
import { tripSensors as checkProximitySensors } from './RangeSensors';
import { tripSensors } from './PointSensors';
import { updatePosition } from './TrolleyUI';
import { TROLLEY_LENGTH } from '../constants';

const TROLLEY_EDGES = TROLLEY_LENGTH / 2;

export const startAnimation = () => {
  const { isLayover, speed, direction } = getState();
  const isPowered = booleanRead(POWER_BTN);
  const isPaused = booleanRead(PAUSE_BTN);
  const isDisabled = isLayover || !isPowered || isPaused;

  if (!isDisabled) {
    const position = updatePosition(speed, direction);
    const left = position - TROLLEY_EDGES;
    const right = position + TROLLEY_EDGES;
    checkProximitySensors(left, right);
    tripSensors(position);
  }

  requestAnimationFrame(startAnimation);
};
