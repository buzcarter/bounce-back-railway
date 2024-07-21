// externals
import {
  DirectionTypes, HALT_BTN, PAUSE_BTN, POWER_BTN, SPEED_CONTROL,
  uint10_MAX,
  MAX_SPEED,
} from '../../common';
import { analogRead, getTicks } from '../../microcontroller';
// locals
import { startAnimation } from './AnimateTrolley';
import { refreshDashboard, setStatusLED } from './Dashboard';
import { addSensorsToRail } from './RangeSensors';
import { addStationsToLayout } from './StationsHelper';
import { getPosition, resetPosition } from './TrolleyUI';
import { booleanRead } from './Utils';
import { attachEventHandlers, getPins } from './UXControls';
import { render as addMultimeter } from './Multimeter';
import { attach as attachLogging } from './Logging';
import { startTimer } from './TimerUI';

export const prepareSimulator = () => {
  addStationsToLayout();
  addSensorsToRail();

  resetPosition();

  attachEventHandlers();
  addMultimeter(getPins());
  attachLogging();
};

export const startSimulator = () => {
  startAnimation();
  startTimer();
};

export const updateDashboard = ({
  direction = DirectionTypes.NOT_SET,
  isLayover = false,
  speed = 0,
} = {}) => {
  const position = getPosition();
  const isPowered = booleanRead(POWER_BTN);
  const isPaused = booleanRead(PAUSE_BTN);
  const isSlowHalt = booleanRead(HALT_BTN);
  const powerLevel = analogRead(SPEED_CONTROL) / uint10_MAX;

  setStatusLED({ isPowered, isSlowHalt, isLayover, isPaused });
  refreshDashboard({
    ticks: getTicks(),
    isLayover,
    isPaused,
    direction,
    position,
    powerLevel,
    speed,
    maxSpeed: MAX_SPEED,
  });
};
