// locals
import { getState } from '../../main';
// externals
import { updateDashboard } from '../../simulator';

export const refreshDashboard = () => {
  const { isLayover, isPaused, speed, direction, powerLevel, isSlowHalt } = getState();
  updateDashboard({ isLayover, isPaused, speed, direction, powerLevel, isSlowHalt });
};
