import { loop, setup } from './app/main';
import {
  CLOCK_SPEED, getIsPowered, getTicks, resetTicks, updateTicks,
} from './app/microcontroller';
import { prepareSimulator, startSimulator, updateClock } from './app/simulator';

const onClockTick = () => {
  if (!getIsPowered()) {
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
