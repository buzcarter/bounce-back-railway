import { resetTicks } from './Clock';

let isPowered = false;

export const onPowerBtnClick = () => {
  isPowered = !isPowered;
  if (!isPowered) {
    resetTicks();
  }
};

export const getIsPowered = (): boolean => isPowered;
