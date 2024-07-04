import { CLOCK_SPEED, HALT_DURATION } from "../constants/Constants";
import { int, velocity } from "../interfaces/CoreTypes";
import { setSpeed } from "../main";

let currentStep: int = 0;
let nbrSteps: int = 0;
let originalSpeed: velocity = 0;
let stepSize: number = 0;
let isStopping: boolean = false;

const beginSpeedChange = (speed: velocity) => {
  currentStep = 0;
  nbrSteps = HALT_DURATION / CLOCK_SPEED;
  stepSize = originalSpeed / nbrSteps;

  continueSpeedChange(speed);
};

export const continueSpeedChange = (speed: velocity): boolean => {
  let isComplete = false;
  if (currentStep++ >= nbrSteps) {
    speed = isStopping ? 0 : originalSpeed;
    isComplete = true;
  } else {
    speed += (isStopping ? -1 : 1) * stepSize;
  }

  setSpeed(speed);
  return isComplete;
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
