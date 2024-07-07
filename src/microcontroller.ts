import { CLOCK_SPEED } from './app/constants';
import { resetTicks, updateTicks } from './app/libs/Systemz/Clock';
import { getIsPowered } from './app/libs/Systemz/Power';
import { loop, setup } from './app/main';
import { prepareSimulator } from './app/simulator';
import { moveTrolley } from './app/simulator/components/Trolley';

const onClockTick = () => {
  if (!getIsPowered()) {
    return;
  }

  loop();
  updateTicks();
};

const main = () => {
  prepareSimulator();
  resetTicks();

  setup();
  setInterval(onClockTick, CLOCK_SPEED);

  moveTrolley();
};

main();
