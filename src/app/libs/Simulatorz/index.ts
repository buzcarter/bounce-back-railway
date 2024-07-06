import { PinAssignments } from '../../enums';
import { setupBtn, setupSlider } from './UXControls';
import { addStationsToLayout } from './StationsHelper';
import { resetTrolleyPosition } from './Trolley';
import { onPowerBtnClick } from '../Systemz/Power';
import { addPositionSensors } from './PositionSensorsHelper';

export * from './Dashboard';
export * from './StationsHelper';
export * from './StdOut';
export * from './Trolley';

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
