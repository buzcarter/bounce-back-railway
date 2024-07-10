import { HALT_DURATION } from '../constants';
import { int, velocity } from '../interfaces';
import { setSpeed } from '../main';
// external
import { CLOCK_SPEED } from '../microcontroller';

let currentStep: int = 0;
let nbrSteps: int = 0;
let originalSpeed: velocity = 0;
let stepSize: number = 0;
let isStopping: boolean = false;

export const continueSpeedChange = (speed: velocity): boolean => {
  let isComplete = false;
  if (currentStep++ >= nbrSteps) {
    // eslint-disable-next-line no-param-reassign
    speed = isStopping ? 0 : originalSpeed;
    isComplete = true;
  } else {
    // eslint-disable-next-line no-param-reassign
    speed += (isStopping ? -1 : 1) * stepSize;
  }

  setSpeed(speed);
  return isComplete;
};

const beginSpeedChange = (speed: velocity) => {
  currentStep = 0;
  nbrSteps = HALT_DURATION / CLOCK_SPEED;
  stepSize = originalSpeed / nbrSteps;

  continueSpeedChange(speed);
};

export const slowStart = (currentSpeed: velocity) => {
  isStopping = false;
  beginSpeedChange(currentSpeed);
};

export const slowStop = (currentSpeed: velocity) => {
  originalSpeed = currentSpeed;
  isStopping = true;
  beginSpeedChange(currentSpeed);
};
