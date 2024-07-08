// locals
import { getState } from '../../main';
// externals
import { updateDashboard } from '../../simulator';

export const refreshDashboard = () => {
  const { isLayover, speed, direction, powerLevel, isSlowHalt } = getState();
  updateDashboard({ isLayover, speed, direction, powerLevel, isSlowHalt });
};
// TODO:
