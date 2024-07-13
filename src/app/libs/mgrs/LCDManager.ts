// locals
import { getState } from '../../main';
// externals
import { updateDashboard } from '../../../microcontroller';

export const refreshDashboard = () => {
  const { isLayover, speed, direction } = getState();
  updateDashboard({ isLayover, speed, direction });
};
