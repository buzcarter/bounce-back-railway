import { JsonData } from '../../common';
import { millis } from '../../microcontroller';
// locals
import { CSSClasses, ElementIds } from '../constants';

export const updateStdOut = (message: JsonData) => {
  const p = document.createElement('p');
  Object.entries({
    t: millis(),
    ...message,
  })
    .forEach(([key, value]) => {
      const keyEle = document.createElement('span');
      keyEle.textContent = key;
      keyEle.classList.add(CSSClasses.STD_OUT_KEY);

      const colonEle = document.createTextNode(': ');

      const valueEle = document.createElement('span');
      valueEle.classList.add(CSSClasses.STD_OUT_VALUE);
      valueEle!.textContent = value as unknown as string;

      const spaceEle = document.createTextNode(' ');

      p.appendChild(keyEle);
      p.appendChild(colonEle);
      p.appendChild(valueEle);
      p.appendChild(spaceEle);
    });

  document.getElementById(ElementIds.STD_OUT)!.prepend(p);
};

export const clearStdOut = () => {
  document.getElementById(ElementIds.STD_OUT)!.innerHTML = '';
};
