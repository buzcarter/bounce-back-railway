/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  DASHBORD_CHBX,
  SIGNAL_CHBX,
  STATION_CHBX,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
  CONTROL_PANEL_CHBX,
} from '../../constants';
import { uint8_t } from '../../interfaces';
import { setInitialValue, booleanToggle, analogWrite } from '../../libs/mgrs/ControlManager';
import { CSSClasses, ElementIds } from '../constants';

enum ControlTypes {
  BOOLEAN = 'boolean',
  CHECKBOX = 'checkbox',
  ANALOG = 'analog',
}

const pinSelectorHash = {
  [HALT_BTN]: ElementIds.HALT_BTN,
  [PAUSE_BTN]: ElementIds.PAUSE_BTN,
  [POWER_BTN]: ElementIds.POWER_BTN,
  [REVERSE_BTN]: ElementIds.REVERSE_BTN,

  [SPEED_CONTROL]: ElementIds.SPEED_CONTROL,

  [CONTROL_PANEL_CHBX]: ElementIds.LOG_CONTROL_PANEL,
  [DASHBORD_CHBX]: ElementIds.LOG_DASHBORD,
  [SIGNAL_CHBX]: ElementIds.LOG_SIGNAL,
  [STATION_CHBX]: ElementIds.LOG_STATION,
};

const onClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const { type, pinNbr } = target.dataset;
  const pinInt = parseInt(pinNbr || '', 10);
  switch (type) {
    case ControlTypes.BOOLEAN:
      {
        const isOn = booleanToggle(pinInt);
        target.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, isOn);
      }
      break;
    case ControlTypes.CHECKBOX:
      booleanToggle(pinInt);
      break;
  }
};

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const { pinNbr } = target.dataset;
  const pinInt = parseInt(pinNbr || '', 10);
  analogWrite(pinInt, parseFloat(target.value));
};

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
    case ControlTypes.ANALOG:
      (ele as HTMLInputElement).value = initialValue as string;
      setInitialValue(pin, initialValue, ele.dataset.name as string);
      ele.addEventListener('input', onInputChange);
      break;
    case ControlTypes.CHECKBOX:
    case ControlTypes.BOOLEAN:
      setInitialValue(pin, false, ele.dataset.name as string);
      ele.addEventListener('click', onClick);
      break;
  }
  return ele;
};
