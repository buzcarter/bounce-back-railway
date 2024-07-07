import { uint8_t } from '../../interfaces';
import {
  ENABLE_DASHBORD_LOG,
  ENABLE_SIGNAL_LOG,
  ENABLE_STATION_LOG,
  HALT_BTN, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from '../../constants';
import { updateStdOut } from '../../simulator/components/StdOut';

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
  [ENABLE_DASHBORD_LOG]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [ENABLE_STATION_LOG]: {
    value: null,
    isChanged: false,
    name: '',
  },
  [ENABLE_SIGNAL_LOG]: {
    value: null,
    isChanged: false,
    name: '',
  },
};

export const setInitialValue = (pin: uint8_t, value: unknown, name: string) => {
  currentStates[pin] = {
    value,
    isChanged: false,
    name,
  };
};

export const updateValue = (pin: uint8_t, value: unknown): unknown => {
  const state = currentStates[pin];
  if (!state) {
    return value;
  }

  updateStdOut({
    pin,
    value: value as number,
    name: state.name,
  });

  if (state.value !== value) {
    state.value = value;
    state.isChanged = true;
  } else {
    state.isChanged = false;
  }
  return value;
};

export const hasInputChanged = (pin: uint8_t): boolean => currentStates[pin]?.isChanged ?? false;

export const analogRead = (pin: uint8_t): number => {
  const value = currentStates[pin]?.value ?? 0;
  return pin === SPEED_CONTROL ? value as unknown as number / 100 : 0;
};

export const analogWrite = (pin: uint8_t, value: uint8_t) => {
  updateValue(pin, value);
};

export const booleanRead = (pin: uint8_t): boolean => Boolean(currentStates[pin]?.value);
export const booleanToggle = (pin: uint8_t): boolean => {
  const state = currentStates[pin];
  if (!state) {
    return false;
  }
  return updateValue(pin, !state.value) as boolean;
};

export const resetChangeFlags = () => {
  Object.values(currentStates).forEach((state) => {
    // eslint-disable-next-line no-param-reassign
    state.isChanged = false;
  });
};
