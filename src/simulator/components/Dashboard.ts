import {
  int, pixels, velocity,
  DirectionTypes,
  DASHBORD_CHBX,
} from '../../common';
// locals
import { CSSClasses, ElementIds } from '../constants';
import { updateStdOut } from './StdOut';
import { booleanRead } from './Utils';

export const refreshDashboard = (
  { isLayover, isPaused, direction, position, powerLevel, speed, maxSpeed }: {
    isLayover: boolean,
    isPaused: boolean,
    direction: DirectionTypes,
    position: pixels,
    powerLevel: number,
    speed: velocity,
    maxSpeed: velocity,
  },
) => {
  const currentState = {
    action: isLayover || isPaused ? 'Pause' : 'Move',
    direction: direction === DirectionTypes.RIGHT ? 'Right' : 'Left',
    position: position.toFixed(1),
    power: `${(powerLevel * 100).toFixed(1)}%`,
    speed: speed.toFixed(1),
    // eslint-disable-next-line no-mixed-operators
    maxSpeed: maxSpeed.toFixed(1),
  };

  document.getElementById(ElementIds.DSPLY_DIRECTION)!.classList.toggle(CSSClasses.ICON_ROTATE, direction === DirectionTypes.LEFT);
  (document.getElementById(ElementIds.DSPLY_POSITION) as HTMLInputElement).value = currentState.position;
  (document.getElementById(ElementIds.DSPLY_POWER) as HTMLInputElement).value = currentState.power;
  (document.getElementById(ElementIds.DSPLY_SPEED) as HTMLInputElement).value = currentState.speed;
  (document.getElementById(ElementIds.DSPLY_MAX_SPEED) as HTMLInputElement).value = currentState.maxSpeed;

  if (booleanRead(DASHBORD_CHBX)) {
    updateStdOut(currentState);
  }
};

export const updateClock = (ticks: int) => {
  (document.getElementById(ElementIds.DSPLY_CLOCK) as HTMLInputElement).value = ticks as unknown as string;
};

export const setStatusLED = ({ isPowered, isSlowHalt, isLayover, isPaused }: {
  isPowered: boolean,
  isSlowHalt: boolean,
  isLayover: boolean,
  isPaused: boolean,
}) => {
  // eslint-disable-next-line no-nested-ternary
  const statusClass = (!isPowered || isSlowHalt)
    ? CSSClasses.STATUS_STOPPED
    : (isLayover || isPaused ? CSSClasses.STATUS_PAUSED : CSSClasses.STATUS_MOVING);
  const ledEle = document.getElementById(ElementIds.STATUS);
  ledEle!.classList.remove(CSSClasses.STATUS_PAUSED, CSSClasses.STATUS_MOVING, CSSClasses.STATUS_STOPPED);
  ledEle!.classList.add(statusClass);
};