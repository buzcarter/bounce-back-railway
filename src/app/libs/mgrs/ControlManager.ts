import {
  uint10_t,
  uint8_t,
  uint10_MAX,

  CONTROL_PANEL_CHBX, DASHBORD_CHBX, SIGNAL_CHBX, STATION_CHBX,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN,
  SPEED_CONTROL,
  SENSOR_26TH_AVE_XING, SENSOR_ATWATER_XING, SENSOR_LT_LA, SENSOR_MIDDLE_BURBANK, SENSOR_RT_CLAREMONT, SENSOR_SOUTH_GATE_XING,
  SENSOR_VOLTS_ALL_CLEAR,
} from '../../../common';
import { Serial } from '../../../microcontroller';

interface CurrentState {
  value: unknown,
  isChanged: boolean,
  name: string,
}

interface CurrentStates {
  [key: string]: CurrentState,
}

const currentStates: CurrentStates = {
  [HALT_BTN]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [POWER_BTN]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [REVERSE_BTN]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [PAUSE_BTN]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [SPEED_CONTROL]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [CONTROL_PANEL_CHBX]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [DASHBORD_CHBX]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [STATION_CHBX]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [SIGNAL_CHBX]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [SENSOR_LT_LA]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
  [SENSOR_RT_CLAREMONT]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
  [SENSOR_MIDDLE_BURBANK]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
  [SENSOR_ATWATER_XING]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
  [SENSOR_SOUTH_GATE_XING]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
  [SENSOR_26TH_AVE_XING]: {
    value: SENSOR_VOLTS_ALL_CLEAR,
    isChanged: false,
    name: '',
  },
};

/**
 * @protected
 */
export const setInitialValue = (pin: uint8_t, value: unknown, name: string) => {
  currentStates[pin] = {
    value,
    isChanged: false,
    name,
  };
};

const updateValue = (pin: uint8_t, value: unknown): unknown => {
  const state = currentStates[pin];
  if (!state) {
    return value;
  }

  // eslint-disable-next-line no-use-before-define
  if (booleanRead(CONTROL_PANEL_CHBX)) {
    Serial.println({
      pin,
      value: value as number,
      name: state.name,
    });
  }

  if (state.value !== value) {
    state.value = value;
    state.isChanged = true;
  } else {
    state.isChanged = false;
  }
  return value;
};

/** Reads the pin's change/dirty flag */
export const hasInputChanged = (pin: uint8_t): boolean => currentStates[pin]?.isChanged ?? false;

/**  */
export const resetChangeFlags = () => {
  Object.values(currentStates).forEach((state) => {
    // eslint-disable-next-line no-param-reassign
    state.isChanged = false;
  });
};

/** Returns a 10-bit number between 0 and 1023 */
export const analogRead = (pin: uint8_t): uint10_t => (currentStates[pin]?.value as unknown as uint8_t) ?? 0;

/** Set to between 0 and 1023 */
export const analogWrite = (pin: uint8_t, value: uint10_t) => {
  if (value < 0 || value > uint10_MAX) {
    Serial.println({ error: 'Value out of range (uint10_t between 0 - 1023)', pin, value });
    throw new Error(`analogWrite: Invalid value: ${value}`);
  }
  updateValue(pin, value);
};

/**  */
export const booleanRead = (pin: uint8_t): boolean => Boolean(currentStates[pin]?.value);

/**  */
export const booleanToggle = (pin: uint8_t): boolean => {
  const state = currentStates[pin];
  if (!state) {
    return false;
  }
  return updateValue(pin, !state.value) as boolean;
};

export const booleanWrite = (pin: uint8_t, value: boolean) => {
  updateValue(pin, Boolean(value));
};
