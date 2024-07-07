import { JsonData } from '../../interfaces';
import { CSSClasses, ids } from '../constants';

export const updateStdOut = (message: JsonData) => {
  const stdOutEle = document.getElementById(ids.STD_OUT);
  Object.entries(message).forEach(([key, value]) => {
    const keyEle = document.createElement('span');
    keyEle.textContent = key;
    keyEle.classList.add(CSSClasses.STD_OUT_KEY);

    const colonEle = document.createTextNode(': ');

    const valueEle = document.createElement('span');
    valueEle.classList.add(CSSClasses.STD_OUT_VALUE);
    valueEle!.textContent = value as unknown as string;

    const spaceEle = document.createTextNode(' ');

    stdOutEle!.appendChild(keyEle);
    stdOutEle!.appendChild(colonEle);
    stdOutEle!.appendChild(valueEle);
    stdOutEle!.appendChild(spaceEle);
  });

  const lineBreakEle = document.createElement('br');
  stdOutEle!.appendChild(lineBreakEle);
};
