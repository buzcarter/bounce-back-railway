/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ENABLE_DASHBORD_LOG,
  ENABLE_SIGNAL_LOG,
  ENABLE_STATION_LOG,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from '../../constants';
import { uint8_t } from '../../interfaces';
import { setInitialValue, booleanToggle, analogWrite } from '../../libs/mgrs/ControlManager';
import { CSSClasses, ids } from '../constants';

const pinSelectorHash = {
  [HALT_BTN]: ids.HALT_BTN,
  [PAUSE_BTN]: ids.PAUSE_BTN,
  [POWER_BTN]: ids.POWER_BTN,
  [REVERSE_BTN]: ids.REVERSE_BTN,

  [SPEED_CONTROL]: ids.SPEED_CONTROL,

  [ENABLE_DASHBORD_LOG]: ids.ENABLE_DASHBORD_LOG,
  [ENABLE_SIGNAL_LOG]: ids.ENABLE_SIGNAL_LOG,
  [ENABLE_STATION_LOG]: ids.ENABLE_STATION_LOG,
};

function onClick(event: Event) {
  const target = event.target as HTMLElement;
  const { type, pinNbr } = target.dataset;
  const pinInt = parseInt(pinNbr || '', 10);
  switch (type) {
    case 'boolean':
      {
        const isOn = booleanToggle(pinInt);
        target.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, isOn);
      }
      break;
    case 'checkbox':
      booleanToggle(pinInt);
      break;
  }
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const { pinNbr } = target.dataset;
  const pinInt = parseInt(pinNbr || '', 10);
  analogWrite(pinInt, parseFloat(target.value));
}

const pinToElement = (pin: uint8_t): HTMLElement | null => {
  const selector = pinSelectorHash[pin];
  if (!selector) {
    return null;
  }

  return document.getElementById(selector);
};

export const setupBtn = (pin: uint8_t, initialValue: unknown = false) => {
  const ele = pinToElement(pin) as HTMLElement;
  if (!ele) {
    return null;
  }

  ele.dataset.pinNbr = pin as unknown as string;
  const { type } = ele.dataset;
  switch (type) {
    case 'analog':
      (ele as HTMLInputElement).value = initialValue as string;
      setInitialValue(pin, initialValue, ele.dataset.name as string);
      ele.addEventListener('input', onInputChange);
      break;
    case 'checkbox':
    case 'boolean':
      setInitialValue(pin, false, ele.dataset.name as string);
      ele.addEventListener('click', onClick);
      break;
  }
  return ele;
};
