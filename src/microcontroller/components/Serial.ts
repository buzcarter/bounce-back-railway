import { JsonData, int } from '../../common';
import { updateStdOut } from '../../simulator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const begin = (baudRate: int) => {};

export const println = (message: JsonData) => {
  updateStdOut(message);
};
