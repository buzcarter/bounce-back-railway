import { int, uint8_t } from '../../common';
import { analogRead } from '../../microcontroller';
import { CSSClasses, ElementIds } from '../constants';

const getId = (val: int) => `multimeter-element-${val}`;

export const render = (pins: uint8_t[]) => {
  const ul = document.getElementById(ElementIds.MULTMETR);

  pins.forEach((pin) => {
    const strongEle = document.createElement('strong');
    strongEle.textContent = `${pin}`;
    strongEle.classList.add(CSSClasses.MULTIMETER__PIN);

    const codeEle = document.createElement('code');
    codeEle.textContent = `${analogRead(pin) ?? ''}`;
    codeEle.id = getId(pin);
    codeEle.classList.add(CSSClasses.MULTIMETER__VALUE);

    const liEle = document.createElement('li');
    liEle.appendChild(strongEle);
    liEle.appendChild(codeEle);
    liEle.classList.add(CSSClasses.MULTIMETER__ITEM);

    ul?.appendChild(liEle);
  });
};

export const update = (pin: uint8_t, value: int) => {
  const ele = document.getElementById(getId(pin));
  if (ele) {
    ele.textContent = (value || 0).toFixed(1);
  }
};
