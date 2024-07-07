import { setupBtn, setupSlider } from './components/UXControls';
import { addStationsToLayout } from './components/StationsHelper';
import { resetTrolleyPosition } from './components/Trolley';
import { addPositionSensors } from './components/PositionSensorsHelper';
import { onPowerBtnClick } from '../microcontroller/components/Power';
import { PinAssignments } from '../enums';

export * from './components/Dashboard';
export * from './components/StationsHelper';
export * from './components/StdOut';
export * from './components/Trolley';

export const prepareSimulator = () => {
  addStationsToLayout();
  addPositionSensors();

  resetTrolleyPosition();

  setupBtn(PinAssignments.POWER_BTN, onPowerBtnClick);

  setupBtn(PinAssignments.HALT_BTN);
  setupBtn(PinAssignments.PAUSE_BTN);
  setupBtn(PinAssignments.REVERSE_BTN);
  setupSlider(PinAssignments.SPEED_CONTROL, 50.0);
};
