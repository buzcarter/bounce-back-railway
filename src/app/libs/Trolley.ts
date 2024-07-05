import { INITIAL_TROLLEY_POSITION, MAX_RIGHT_EDGE, MIN_LEFT_EDGE } from "../constants/Constants";
import { ids } from "../constants/ElementIds";
import { pixels } from "../interfaces/CoreTypes";
import { DirectionTypes } from "../interfaces/DirectionTypes";
import { updateStdOut } from "./StdOut";

let position: pixels = INITIAL_TROLLEY_POSITION;

const trolleyEle = document.getElementById(ids.VEHICLE) || document.createElement('div');

export const moveTrolley = ({ isLayover, isPaused, isPowered, speed, direction }:
  { isLayover: boolean; isPaused: boolean; isPowered: boolean; speed: number; direction: DirectionTypes }
) => {
  if (isLayover || !isPowered || isPaused) {
    return;
  }
  position += speed * direction;
  if (position <= MIN_LEFT_EDGE || position >= MAX_RIGHT_EDGE) {
    updateStdOut({
      message: `Trolley has crashed at position ${position}!`,
      type: 'error',
    });
    throw new Error('CRASH!!!');
  }
  trolleyEle.style.left = `${position}px`;
};

export const getPosition = () => position;

export const resetTrolleyPosition = () => {
  position = INITIAL_TROLLEY_POSITION;
  trolleyEle.style.left = `${position}px`;
};
