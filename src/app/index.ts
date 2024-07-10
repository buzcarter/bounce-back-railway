/**
 * This is the public interface (the cheat) to innerworkings of the app.
 * Only explose what is necessary to the outside world.
 */

// Used by microcontroller
export { booleanRead } from './libs/mgrs/ControlManager';
export { loop, setup } from './main';

// used by simulator
export {
  analogRead,
  analogWrite,
  // booleanRead,
  booleanToggle,
  setInitialValue,
} from './libs/mgrs/ControlManager';

export {
  getState,
} from './main';
