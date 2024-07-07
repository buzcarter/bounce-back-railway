import { DirectionTypes, ENABLE_DASHBORD_LOG } from '../../constants';
import { clockTick, int, pixels, velocity } from '../../interfaces';
import { booleanRead } from '../../libs/mgrs/ControlManager';
import { CLOCK_SPEED } from '../../microcontroller';
import { CSSClasses, ids } from '../constants';
import { updateStdOut } from './StdOut';

export const refreshDashboard = (
  { ticks, isLayover, isPaused, direction, position, powerLevel, speed, maxSpeed }: {
    ticks: clockTick,
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
    ticks,
    action: isLayover || isPaused ? 'Pause' : 'Move',
    direction: direction === DirectionTypes.RIGHT ? 'Right' : 'Left',
    position: position.toFixed(1),
    power: `${(powerLevel * 100).toFixed(1)}%`,
    speed: `${((1000 / CLOCK_SPEED) * speed).toFixed(1)} px/s`,
    // eslint-disable-next-line no-mixed-operators
    maxSpeed: `${((1000 / CLOCK_SPEED) * maxSpeed).toFixed(1)} px/s`,
  };

  const directionEle = document.getElementById(ids.DSPLY_DIRECTION);
  directionEle!.classList.toggle(CSSClasses.LEFT_ARROW, direction === DirectionTypes.LEFT);
  directionEle!.classList.toggle(CSSClasses.RIGHT_ARROW, direction === DirectionTypes.RIGHT);

  (document.getElementById(ids.DSPLY_COMMAND) as HTMLInputElement).value = currentState.action;
  (document.getElementById(ids.DSPLY_POSITION) as HTMLInputElement).value = currentState.position;
  (document.getElementById(ids.DSPLY_POWER) as HTMLInputElement).value = currentState.power;
  (document.getElementById(ids.DSPLY_SPEED) as HTMLInputElement).value = currentState.speed;
  (document.getElementById(ids.DSPLY_MAX_SPEED) as HTMLInputElement).value = currentState.maxSpeed;

  if (booleanRead(ENABLE_DASHBORD_LOG)) {
    updateStdOut(currentState);
  }
};

export const updateClock = (ticks: int) => {
  (document.getElementById(ids.DSPLY_CLOCK) as HTMLInputElement).value = ticks as unknown as string;
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
  const ledEle = document.getElementById(ids.STATUS);
  ledEle!.classList.remove(CSSClasses.STATUS_PAUSED, CSSClasses.STATUS_MOVING, CSSClasses.STATUS_STOPPED);
  ledEle!.classList.add(statusClass);
};
