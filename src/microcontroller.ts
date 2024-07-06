import { CLOCK_SPEED } from './app/constants';
import { resetTicks, updateTicks } from './app/libs/System/Clock';
import { getIsPowered } from './app/libs/System/Power';
import { moveTrolley, prepareSimulator } from './app/libs/Simulator';
import { loop, setup } from './app/main';

const onClickTick = () => {
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
  setInterval(onClickTick, CLOCK_SPEED);

  moveTrolley();
}

main();
