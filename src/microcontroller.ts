import { CLOCK_SPEED } from './app/constants';
import { resetTicks, updateTicks } from './app/libs/Systemz/Clock';
import { getIsPowered } from './app/libs/Systemz/Power';
import { moveTrolley, prepareSimulator } from './app/libs/Simulatorz';
import { loop, setup } from './app/main';

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
