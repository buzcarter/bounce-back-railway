// externals
import { getState } from '../../app/main';
import { booleanRead } from '../../app/libs/mgrs/ControlManager';
import { PAUSE_BTN, POWER_BTN } from '../../app/constants';
// locals
import { tripSensors as tripRangeSensors } from './RangeSensors';
import { tripSensors as tripPointSensors } from './PointSensors';
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
    tripRangeSensors(left, right);
    tripPointSensors(position);
  }

  requestAnimationFrame(startAnimation);
};
