// externals
import { POWER_BTN, PAUSE_BTN, TROLLEY_LENGTH } from '../../common';
import { getState, booleanRead } from '../../app';
// locals
import { tripSensors as tripRangeSensors } from './RangeSensors';
import { tripSensors as tripPointSensors } from './PointSensors';
import { updatePosition } from './TrolleyUI';

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
