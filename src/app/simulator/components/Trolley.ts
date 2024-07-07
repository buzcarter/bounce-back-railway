// externals
import { pixels } from '../../interfaces';
import { getState } from '../../main';
// locals
import { updateStdOut } from './StdOut';
import { checkSensors } from './PositionSensorsHelper';
import { ids, INITIAL_TROLLEY_POSITION, MAX_RIGHT_EDGE, MIN_LEFT_EDGE } from '../constants';
import { booleanRead } from '../../libs/mgrs/ControlManager';
import { PAUSE_BTN, POWER_BTN } from '../../constants';

let position: pixels = INITIAL_TROLLEY_POSITION;

const trolleyEle = document.getElementById(ids.VEHICLE) || document.createElement('div');

export const moveTrolley = () => {
  const isPowered = booleanRead(POWER_BTN);
  const isPaused = booleanRead(PAUSE_BTN);
  const { isLayover, speed, direction } = getState();
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
