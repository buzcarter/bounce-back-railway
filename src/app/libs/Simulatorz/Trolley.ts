import {
  INITIAL_TROLLEY_POSITION, MAX_RIGHT_EDGE, MIN_LEFT_EDGE,
  ids,
} from '../../constants';
import { pixels } from '../../interfaces';
import { updateStdOut } from './StdOut';
import { getState } from '../../main';
import { getIsPowered } from '../Systemz/Power';
import { checkSensors } from './PositionSensorsHelper';

let position: pixels = INITIAL_TROLLEY_POSITION;

const trolleyEle = document.getElementById(ids.VEHICLE) || document.createElement('div');

export const moveTrolley = () => {
  const isPowered = getIsPowered();
  const { isLayover, isPaused, speed, direction } = getState();
  const isDisabled = isLayover || !isPowered || isPaused;
  if (!isDisabled) {
    position += speed * direction;
    if (position <= MIN_LEFT_EDGE || position >= MAX_RIGHT_EDGE) {
      updateStdOut({
        message: `Trolley has crashed at position ${position}!`,
        type: 'error',
      });
      throw new Error('CRASH!!!');
    }

    checkSensors(position - 16, position + 16);
    trolleyEle.style.left = `${position}px`;
  }
  requestAnimationFrame(moveTrolley);
};

export const getPosition = () => position;

export const resetTrolleyPosition = () => {
  position = INITIAL_TROLLEY_POSITION;
  trolleyEle.style.left = `${position}px`;
};
