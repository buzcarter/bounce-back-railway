/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from '../../constants';
import { JsonData, uint8_t } from '../../interfaces';
import { CSSClasses, ids } from '../constants';

const pinSelectorHash = {
  [PAUSE_BTN]: ids.PAUSE_BTN,
  [HALT_BTN]: ids.HALT_BTN,
  [POWER_BTN]: ids.POWER_BTN,
  [REVERSE_BTN]: ids.REVERSE_BTN,
  [SPEED_CONTROL]: ids.SPEED_CONTROL,
};

function onClick() {
  // @ts-expect-error
  this.isOn = !this.isOn;
  // @ts-expect-error
  this.hasChanged = true;
  // @ts-expect-error
  this.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, this.isOn);
}

const pinToElement = (pinNbr: uint8_t): HTMLElement | null => {
  const selector = pinSelectorHash[pinNbr];
  if (!selector) {
    return null;
  }

  return document.getElementById(selector);
};

export const hasInputChanged = (pinNbr: uint8_t): boolean => {
  const ele = pinToElement(pinNbr);
  if (!ele) {
    return false;
  }

  // @ts-expect-error
  const hasChanged = ele!.hasChanged ?? false;
  // @ts-expect-error
  ele!.hasChanged = false;
  return hasChanged;
};

export const readValue = (pinNbr: uint8_t): number => {
  const ele = pinToElement(pinNbr);
  if (!ele) {
    return 0;
  }

  return pinNbr === SPEED_CONTROL
    // @ts-expect-error
    ? ele.value / 100
    : 0;
};

export const setupBtn = (pinNbr: uint8_t, cb?: unknown) => {
  const ele = pinToElement(pinNbr);
  ele!.addEventListener('click', onClick);
  if (typeof cb === 'function') {
    // @ts-expect-error
    ele!.addEventListener('click', cb);
  }
  (ele as unknown as JsonData).hasChanged = false;
  (ele as unknown as JsonData).isOn = false;
  return ele;
};

export const setupSlider = (pinNbr: uint8_t, initialValue: number) => {
  const powerSlider = setupBtn(pinNbr);
  // @ts-expect-error
  powerSlider.value = initialValue;
};
