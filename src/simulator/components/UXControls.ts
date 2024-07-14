/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  uint10_t, uint8_t,
  DASHBORD_CHBX, SIGNAL_CHBX, STATION_CHBX,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN,
  SPEED_CONTROL,
  SENSOR_26TH_AVE_XING, SENSOR_ATWATER_XING, SENSOR_LT_LA, SENSOR_MIDDLE_BURBANK, SENSOR_RT_CLAREMONT, SENSOR_SOUTH_GATE_XING,
  CONTROL_PANEL_CHBX,
  IR_SENSOR__CLEAR,
  uint10_MAX,
  HIGH_LOW_THRESHOLD,
  int,
  DigitalLevels,
  getName as getItemName,
} from '../../common';
import { analogRead, analogWrite } from '../../microcontroller';
// locals
import { CSSClasses, ElementIds } from '../constants';
import { updateStdOut } from './StdOut';

const { LOW, HIGH } = DigitalLevels;

enum ControlTypes {
  BOOLEAN = 'boolean',
  CHECKBOX = 'checkbox',
  ANALOG = 'analog',
}

interface InputControl {
  initialValue: uint10_t,
  name?: string,
}

interface InputControlCacheType {
  [key: string]: InputControl,
}

const inputControls: InputControlCacheType = {
  [HALT_BTN]: {
    initialValue: LOW,
  },
  [POWER_BTN]: {
    initialValue: LOW,
  },
  [REVERSE_BTN]: {
    initialValue: LOW,
  },
  [PAUSE_BTN]: {
    initialValue: LOW,
  },
  [SPEED_CONTROL]: {
    initialValue: Math.floor(uint10_MAX / 2),
  },
  [CONTROL_PANEL_CHBX]: {
    initialValue: LOW,
  },
  [DASHBORD_CHBX]: {
    initialValue: LOW,
  },
  [STATION_CHBX]: {
    initialValue: LOW,
  },
  [SIGNAL_CHBX]: {
    initialValue: LOW,
  },
  [SENSOR_LT_LA]: {
    initialValue: IR_SENSOR__CLEAR,
  },
  [SENSOR_RT_CLAREMONT]: {
    initialValue: IR_SENSOR__CLEAR,
  },
  [SENSOR_MIDDLE_BURBANK]: {
    initialValue: IR_SENSOR__CLEAR,
  },
  [SENSOR_ATWATER_XING]: {
    initialValue: IR_SENSOR__CLEAR,
  },
  [SENSOR_SOUTH_GATE_XING]: {
    initialValue: IR_SENSOR__CLEAR,
  },
  [SENSOR_26TH_AVE_XING]: {
    initialValue: IR_SENSOR__CLEAR,
  },
};

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

const logChange = (pin: uint8_t, value: int): void => {
  if (analogRead(CONTROL_PANEL_CHBX) > HIGH_LOW_THRESHOLD) {
    updateStdOut({
      pin,
      value: value as number,
      // name: obj.name,
    });
  }
};

const toggle = (pin: uint8_t): int => {
  const isTrue = analogRead(pin) > HIGH_LOW_THRESHOLD;
  const newVal = !isTrue ? HIGH : LOW;
  analogWrite(pin, newVal);
  logChange(pin, newVal);
  return newVal;
};

const onClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const { type, pin } = target.dataset;
  const pinInt = parseInt(pin || '', 10);
  switch (type) {
    case ControlTypes.BOOLEAN:
      target.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, toggle(pinInt) > HIGH_LOW_THRESHOLD);
      break;
    case ControlTypes.CHECKBOX:
      toggle(pinInt);
      break;
  }
};

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const { pin } = target.dataset;
  const pinInt = parseInt(pin || '', 10);
  analogWrite(pinInt, parseFloat(target.value));
  logChange(pin as unknown as uint8_t, target.value as unknown as int);
};

const pinToElement = (pin: uint8_t): HTMLElement | null => {
  const selector = pinSelectorHash[pin];
  if (!selector) {
    return null;
  }

  return document.getElementById(selector);
};

export const attachEventHandlers = () => {
  Object.keys(inputControls)
    .forEach((pin) => {
      const pinInt = parseInt(pin || '', 10);
      const ctl = inputControls[pin];
      analogWrite(pinInt, ctl.initialValue);

      const ele = pinToElement(pinInt) as HTMLElement;
      if (!ele) {
        return;
      }

      const { name, type } = ele.dataset;
      ctl.name = name || '';
      ele.dataset.pin = pin;

      switch (type) {
        case ControlTypes.ANALOG:
          (ele as HTMLInputElement).value = ctl.initialValue.toString();
          ele.addEventListener('input', onInputChange);
          break;
        case ControlTypes.CHECKBOX:
        case ControlTypes.BOOLEAN:
          ele.addEventListener('click', onClick);
          break;
      }
    });
};

export const getPins = (): uint8_t[] => Object.keys(inputControls).map((pin) => parseInt(pin, 10));

export const getName = (pin: uint8_t): string => inputControls[pin]?.name || getItemName(pin) || '';
