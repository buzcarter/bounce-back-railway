/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  uint10_t, uint8_t,
  DASHBORD_CHBX, SIGNAL_CHBX, STATION_CHBX,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN,
  SPEED_CONTROL,
  SENSOR_26TH_AVE_XING, SENSOR_ATWATER_XING, SENSOR_LT_LA, SENSOR_MIDDLE_BURBANK, SENSOR_RT_CLAREMONT, SENSOR_SOUTH_GATE_XING,
  SENSOR_VOLTS_ALL_CLEAR,
  CONTROL_PANEL_CHBX,
  LOW,
  uint10_MAX,
  HIGH_LOW_THRESHOLD,
  int,
  HIGH,
} from '../../common';
import { analogRead, analogWrite } from '../../microcontroller';
// locals
import { CSSClasses, ElementIds } from '../constants';

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
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
  },
  [SENSOR_RT_CLAREMONT]: {
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
  },
  [SENSOR_MIDDLE_BURBANK]: {
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
  },
  [SENSOR_ATWATER_XING]: {
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
  },
  [SENSOR_SOUTH_GATE_XING]: {
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
  },
  [SENSOR_26TH_AVE_XING]: {
    initialValue: SENSOR_VOLTS_ALL_CLEAR,
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

const toggle = (pin: uint8_t): int => {
  const isTrue = analogRead(pin) > HIGH_LOW_THRESHOLD;
  const newVal = !isTrue ? HIGH : LOW;
  analogWrite(pin, newVal);
  return newVal;
};

const onClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const { type, pinNbr } = target.dataset;
  const pinInt = parseInt(pinNbr || '', 10);
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
      ele.dataset.pinNbr = pin;

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
