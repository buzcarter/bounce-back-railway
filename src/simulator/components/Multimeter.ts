import { analogRead } from '../../app';
import { getIcon, int, uint8_t } from '../../common';
import { CSSClasses, ElementIds } from '../constants';
import { getName } from './UXControls';

const getValueEleId = (pin: int) => `multimeter-value-${pin}`;
const getPinEleId = (pin: int) => `multimeter-pin-${pin}`;

export const render = (pins: uint8_t[]) => {
  const ul = document.getElementById(ElementIds.MULTMETR);
  if (!ul) {
    return;
  }

  const {
    MULTIMETER__ITEM, MULTIMETER__PIN, MULTIMETER__VALUE, MULTIMETER__NAME, MULTIMETER__ICON,
    ICON, ICON_PREFIX,
  } = CSSClasses;

  pins.forEach((pin) => {
    const pinNbrEle = document.createElement('strong');
    pinNbrEle.textContent = `${pin}`;
    pinNbrEle.id = getPinEleId(pin);
    pinNbrEle.classList.add(MULTIMETER__PIN);

    const nameEle = document.createElement('span');
    nameEle.textContent = getName(pin);
    nameEle.classList.add(MULTIMETER__NAME);

    const valueEle = document.createElement('code');
    valueEle.textContent = `${analogRead(pin) ?? ''}`;
    valueEle.id = getValueEleId(pin);
    valueEle.classList.add(MULTIMETER__VALUE);

    const iconEle = document.createElement('span');
    iconEle.classList.add(MULTIMETER__ICON);
    const icon = getIcon(pin);
    if (icon) {
      iconEle.classList.add(ICON, `${ICON_PREFIX}${icon}`);
    }

    const liEle = document.createElement('li');
    liEle.appendChild(pinNbrEle);
    liEle.appendChild(valueEle);
    liEle.appendChild(nameEle);
    liEle.appendChild(iconEle);
    liEle.classList.add(MULTIMETER__ITEM);

    ul.appendChild(liEle);
  });
};

let valueFlashTimeout: NodeJS.Timeout | null = null;
let pinFlashTimeout: NodeJS.Timeout | null = null;

export const update = (pin: uint8_t, value: int) => {
  const { MULTIMETER__FLASH } = CSSClasses;

  const valueEle = document.getElementById(getValueEleId(pin));
  const pinEle = document.getElementById(getPinEleId(pin));
  if (valueEle && pinEle) {
    valueEle.textContent = (value || 0).toFixed(1);
    valueEle.classList.add(MULTIMETER__FLASH);
    pinEle.classList.add(MULTIMETER__FLASH);

    if (!valueFlashTimeout) {
      valueFlashTimeout = setTimeout(() => {
        valueEle.classList.remove(MULTIMETER__FLASH);
        valueFlashTimeout = null;
      }, 500);
    }

    if (!pinFlashTimeout) {
      pinFlashTimeout = setTimeout(() => {
        pinEle.classList.remove(MULTIMETER__FLASH);
        pinFlashTimeout = null;
      }, 1500);
    }
  }
};
