// externals
import {
  DirectionTypes,
  HALT_BTN, MAX_SPEED, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from '../constants';
import { getIsPowered, getTicks, onPowerBtnClick } from '../microcontroller';
// locals
import { refreshDashboard, setStatusLED } from './components/Dashboard';
import { addPositionSensors } from './components/PositionSensorsHelper';
import { addStationsToLayout } from './components/StationsHelper';
import { getPosition, moveTrolley, resetTrolleyPosition } from './components/Trolley';
import { setupBtn, setupSlider } from './components/UXControls';

export { setupBtn, setupSlider, readValue } from './components/UXControls';
export { updateClock } from './components/Dashboard';

export const prepareSimulator = () => {
  addStationsToLayout();
  addPositionSensors();

  resetTrolleyPosition();

  setupBtn(POWER_BTN, onPowerBtnClick);
  setupBtn(HALT_BTN);
  setupBtn(PAUSE_BTN);
  setupBtn(REVERSE_BTN);
  setupSlider(SPEED_CONTROL, 50.0);
};

export const startSimulator = () => {
  // checkStations();
  moveTrolley();
};

export const updateDashboard = ({
  direction = DirectionTypes.NOT_SET,
  isLayover = false,
  isPaused = false,
  isSlowHalt = false,
  powerLevel = 0,
  speed = 0,
} = {}) => {
  const position = getPosition();
  setStatusLED({ isPowered: getIsPowered(), isSlowHalt, isLayover, isPaused });
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
