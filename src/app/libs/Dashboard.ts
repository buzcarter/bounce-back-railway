import { CLOCK_SPEED } from "../constants/Constants";
import { ids } from "../constants/ElementIds";
import { CSSClasses } from "../interfaces/CSSClasses";
import { DirectionTypes } from "../interfaces/DirectionTypes";
import { updateStdOut } from "./StdOut";
import { clockTick, int, pixels, velocity } from "../interfaces/CoreTypes";

interface DashboardUpdateParams {
  ticks: clockTick;
  isLayover: boolean;
  isPaused: boolean;
  direction: DirectionTypes;
  position: pixels;
  powerLevel: number;
  speed: velocity;
  maxSpeed: velocity;
}

export const updateDashboard = (
  { ticks, isLayover, isPaused, direction, position, powerLevel, speed, maxSpeed }: DashboardUpdateParams
) => {
  const currentState = {
    ticks,
    action: isLayover || isPaused ? 'Pause' : 'Move',
    direction: direction === DirectionTypes.RIGHT ? 'Right' : 'Left',
    position: position.toFixed(1),
    power: `${(powerLevel * 100).toFixed(1)}%`,
    speed: `${(1000 / CLOCK_SPEED * speed).toFixed(1)} px/s`,
    // eslint-disable-next-line no-mixed-operators
    maxSpeed: `${(1000 / CLOCK_SPEED * maxSpeed).toFixed(1)} px/s`,
  };

  const directionEle = document.getElementById(ids.DSPLY_DIRECTION);
  directionEle!.classList.toggle(CSSClasses.LEFT_ARROW, direction === DirectionTypes.LEFT);
  directionEle!.classList.toggle(CSSClasses.RIGHT_ARROW, direction === DirectionTypes.RIGHT);

  (document.getElementById(ids.DSPLY_COMMAND) as HTMLInputElement).value = currentState.action;
  (document.getElementById(ids.DSPLY_POSITION) as HTMLInputElement).value = currentState.position;
  (document.getElementById(ids.DSPLY_POWER) as HTMLInputElement).value = currentState.power;
  (document.getElementById(ids.DSPLY_SPEED) as HTMLInputElement).value = currentState.speed;
  (document.getElementById(ids.DSPLY_MAX_SPEED) as HTMLInputElement).value = currentState.maxSpeed;

  if ((document.getElementById(ids.ENABLE_LOGGING) as HTMLInputElement).checked) {
    updateStdOut(currentState);
  }
};
