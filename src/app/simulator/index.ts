// externals
import {
  DirectionTypes, DASHBORD_CHBX, SIGNAL_CHBX, STATION_CHBX, HALT_BTN, MAX_SPEED, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
  uint10_MAX,
  CONTROL_PANEL_CHBX,
} from '../constants';
import { analogRead, booleanRead } from '../libs/mgrs/ControlManager';
import { getTicks } from '../microcontroller';
// locals
import { refreshDashboard, setStatusLED } from './components/Dashboard';
import { addPositionSensors } from './components/PositionSensorsHelper';
import { addStationsToLayout } from './components/StationsHelper';
import { getPosition, moveTrolley, resetTrolleyPosition } from './components/Trolley';
import { setupBtn } from './components/UXControls';

export { setupBtn } from './components/UXControls';
export { updateClock } from './components/Dashboard';
export { checkStations, getCurrentStation, getCurrentStationId } from './components/StationsHelper';

export const prepareSimulator = () => {
  addStationsToLayout();
  addPositionSensors();

  resetTrolleyPosition();

  setupBtn(POWER_BTN);
  setupBtn(HALT_BTN);
  setupBtn(PAUSE_BTN);
  setupBtn(REVERSE_BTN);
  setupBtn(SPEED_CONTROL, uint10_MAX / 2);
  setupBtn(CONTROL_PANEL_CHBX);
  setupBtn(DASHBORD_CHBX);
  setupBtn(SIGNAL_CHBX);
  setupBtn(STATION_CHBX);
};

export const startSimulator = () => {
  moveTrolley();
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
