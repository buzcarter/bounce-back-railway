// externals
import { pixels, velocity } from '../../interfaces';
import { DirectionTypes } from '../../constants';
// locals
import { updateStdOut } from './StdOut';
import { ElementIds, INITIAL_TROLLEY_POSITION, MAX_RIGHT_EDGE, MIN_LEFT_EDGE } from '../constants';

let position: pixels = INITIAL_TROLLEY_POSITION;

const trolleyEle = document.getElementById(ElementIds.TROLLEY) || document.createElement('div');

export const updatePosition = (speed: velocity, direction: DirectionTypes): pixels => {
  position += speed * direction;
  if (position <= MIN_LEFT_EDGE || position >= MAX_RIGHT_EDGE) {
    updateStdOut({
      message: `Trolley has crashed at position ${position}!`,
      type: 'error',
    });
    throw new Error('CRASH!!!');
  }
  trolleyEle.style.left = `${position}px`;
  return position;
};

export const getPosition = () => position;

export const resetPosition = () => {
  position = INITIAL_TROLLEY_POSITION;
  trolleyEle.style.left = `${position}px`;
};
