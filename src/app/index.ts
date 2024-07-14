/**
 * This is the public interface (the cheat) to innerworkings of the app.
 * Only explose what is necessary to the outside world.
 */

// Used by microcontroller
export { loop, setup } from './main';

// used by simulator
export { getState } from './main';
