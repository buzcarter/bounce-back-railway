// externals
import { getState } from '../../main';
import { booleanRead } from '../../libs/mgrs/ControlManager';
import { PAUSE_BTN, POWER_BTN } from '../../constants';
// locals
import { checkSensors } from './PositionSensorsHelper';
import { updatePosition } from './TrolleyUI';

export const startAnimation = () => {
  const { isLayover, speed, direction } = getState();
  const isPowered = booleanRead(POWER_BTN);
  const isPaused = booleanRead(PAUSE_BTN);
  const isDisabled = isLayover || !isPowered || isPaused;

  if (!isDisabled) {
    const position = updatePosition(speed, direction);
    checkSensors(position - 16, position + 16);
  }

  requestAnimationFrame(startAnimation);
};
