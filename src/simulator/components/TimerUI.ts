/* eslint-disable no-console */
import CountdownTimer from './CountdownTimer';

let repeat = 0;

const countdownTimer = new CountdownTimer({
  containerId: 'layout-timer',
  timerDuration: 20,
  clockSpeed: 25,
  lineWidth: 4,
  onDone: () => {
    console.log(`Countdown ${++repeat} ended!`);
    if (repeat > 3) {
      console.log('All done!');
      return;
    }

    setTimeout(() => countdownTimer.set(10), 1500);
    setTimeout(() => countdownTimer.start(), 6000);
  },
});

export const startTimer = () => {
  countdownTimer.start();
};
