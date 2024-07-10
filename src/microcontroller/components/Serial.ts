import { JsonData, int } from '../../app/interfaces';
import { updateStdOut } from '../../simulator/components/StdOut';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const begin = (baudRate: int) => {};

export const println = (message: JsonData) => {
  updateStdOut(message);
};
