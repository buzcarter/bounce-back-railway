import { ElementIds } from '../constants';
import { clearStdOut } from './StdOut';

export const attach = () => {
  document.getElementById(ElementIds.CLEAR_LOGS_BTN)?.addEventListener('click', () => {
    clearStdOut();
  });
};
