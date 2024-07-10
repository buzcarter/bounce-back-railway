// locals
import { getState } from '../../main';
// externals
// TODO: don't talk to Simulator from the App
import { updateDashboard } from '../../../simulator';

export const refreshDashboard = () => {
  const { isLayover, speed, direction } = getState();
  updateDashboard({ isLayover, speed, direction });
};
