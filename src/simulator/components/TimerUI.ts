/* eslint-disable no-console */
import CountdownTimer from './CountdownTimer';

const Selectors = {
  TIMER_ID: 'layout-timer',
};

const CSSClasses = {
  FADE: 'base-timer--fade',
};

let countdownTimer: CountdownTimer;

export const attachTimer = () => {
  document.getElementById(Selectors.TIMER_ID)!.classList.add(CSSClasses.FADE);
  countdownTimer = new CountdownTimer({
    containerId: Selectors.TIMER_ID,
    timerDuration: 0,
    clockSpeed: 25,
    lineWidth: 4,
    onDone: () => {
      setTimeout(() => {
        document.getElementById(Selectors.TIMER_ID)!.classList.add(CSSClasses.FADE);
      }, 700);
    },
  });
};

export const startTimer = (timerDuration: number) => {
  document.getElementById(Selectors.TIMER_ID)!.classList.remove(CSSClasses.FADE);

  countdownTimer.set(timerDuration);
  countdownTimer.start();
};
