import { POWER_BTN, CLOCK_SPEED, HIGH_LOW_THRESHOLD } from '../common';
import { loop, setup } from '../app';
import { prepareSimulator, startSimulator, updateClock } from '../simulator';
// locals
import { getTicks, resetTicks, updateTicks } from './components/Clock';
import { analogRead } from './components/AnalogWiring';

const onClockTick = () => {
  if (analogRead(POWER_BTN) < HIGH_LOW_THRESHOLD) {
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
