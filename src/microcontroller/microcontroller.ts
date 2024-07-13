import { POWER_BTN } from '../common';
import { loop, setup } from '../app';
import { prepareSimulator, startSimulator, updateClock } from '../simulator';
// locals
import { getTicks, resetTicks, updateTicks } from './components/Clock';
import { CLOCK_SPEED } from '../common';
import { booleanRead } from '../simulator/components/Utils';

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
