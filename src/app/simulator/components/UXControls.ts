/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PinAssignments } from '../../constants';
import { JsonData } from '../../interfaces';
import { CSSClasses, ids } from '../constants';

const pinSelectorHash = {
  [PinAssignments.PAUSE_BTN]: ids.PAUSE_BTN,
  [PinAssignments.HALT_BTN]: ids.HALT_BTN,
  [PinAssignments.POWER_BTN]: ids.POWER_BTN,
  [PinAssignments.REVERSE_BTN]: ids.REVERSE_BTN,
  [PinAssignments.SPEED_CONTROL]: ids.SPEED_CONTROL,
};

function onClick() {
  // @ts-expect-error
  this.isOn = !this.isOn;
  // @ts-expect-error
  this.hasChanged = true;
  // @ts-expect-error
  this.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, this.isOn);
}

const pinToElement = (pinNbr: PinAssignments): HTMLElement | null => {
  const selector = pinSelectorHash[pinNbr];
  if (!selector) {
    return null;
  }

  return document.getElementById(selector);
};

export const hasInputChanged = (pinNbr: PinAssignments): boolean => {
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

export const readValue = (pinNbr: PinAssignments): number => {
  const ele = pinToElement(pinNbr);
  if (!ele) {
    return 0;
  }

  return pinNbr === PinAssignments.SPEED_CONTROL
    // @ts-expect-error
    ? ele.value / 100
    : 0;
};

export const setupBtn = (pinNbr: PinAssignments, cb?: unknown) => {
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

export const setupSlider = (pinNbr: PinAssignments, initialValue: number) => {
  const powerSlider = setupBtn(pinNbr);
  // @ts-expect-error
  powerSlider.value = initialValue;
};
