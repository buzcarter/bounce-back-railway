/* eslint-disable no-console */
import { int, LCD_TX } from '../../common';
import { eventManager } from '../../microcontroller';
import CountdownTimer from './CountdownTimer';

const Selectors = {
  TIMER_ID: 'layout-timer',
};

const CSSClasses = {
  FADE: 'base-timer__wrap--fade',
};

let countdownTimer: CountdownTimer;

/**
 * Shoqa & atarts the timer with the specified duration.
 * @param timerDuration The duration of the timer in seconds.
 */
export const startTimer = (timerDuration: number) => {
  document.getElementById(Selectors.TIMER_ID)!.classList.remove(CSSClasses.FADE);

  countdownTimer.set(timerDuration);
  countdownTimer.start();
};

export const attachTimer = () => {
  eventManager.on(LCD_TX, (value: unknown) => {
    startTimer(value as int);
  });

  document.getElementById(Selectors.TIMER_ID)!.classList.add(CSSClasses.FADE);
  countdownTimer = new CountdownTimer({
    containerId: Selectors.TIMER_ID,
    timerDuration: 0,
    clockSpeed: 25,
    lineWidth: 4,
    onDone: () => {
      setTimeout(() => {
        document.getElementById(Selectors.TIMER_ID)!.classList.add(CSSClasses.FADE);
      }, 1050);
    },
  });
};
