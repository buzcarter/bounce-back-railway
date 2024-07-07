import { POWER_BTN } from './app/constants';
import { booleanRead } from './app/libs/mgrs/ControlManager';
import { loop, setup } from './app/main';
import { CLOCK_SPEED, getTicks, resetTicks, updateTicks } from './app/microcontroller';
import { prepareSimulator, startSimulator, updateClock } from './app/simulator';

const onClockTick = () => {
  if (!booleanRead(POWER_BTN)) {
    return;
  }

  updateClock(getTicks());
  loop();
  updateTicks();
};

const main = () => {
  prepareSimulator();
  resetTicks();
  setup();
  setInterval(onClockTick, CLOCK_SPEED);
  startSimulator();
};

main();
