// externals
import {
  Serial, analogRead, analogWrite, millis, pinMode,
} from '../microcontroller';
import {
  int, uint8_t, velocity, getStations, MAX_SPEED, DASHBOARD_REFRESH_RATE,
  DirectionTypes, HALT_BTN, PAUSE_BTN, REVERSE_BTN, SPEED_CONTROL,
  uint10_MAX,
  OutputModes,
  unsigned_long,
  LCD_TX,
} from '../common';
// locals
import { slowStop, slowStart, continueSpeedChange } from './libs/mgrs/EaseSpeed';
import { EventTypes, getEvent, setEvent } from './libs/mgrs/EventManager';
import { refreshDashboard } from './libs/mgrs/LCDManager';
import { StationTransistions } from './libs/mgrs/StationManager';
import {
  booleanRead, ctlPinMode, hasInputChanged, pollInputs, resetChangeFlags,
} from './libs/mgrs/ControlManager';
import { getTransition, pollSensors as pollPointSensors, getCurrentStationId } from './libs/mgrs/PointCensorManager';

const { INPUT, OUTPUT } = OutputModes;

let direction: DirectionTypes = DirectionTypes.NOT_SET;
/** (px/tick) current speed */
let speed: velocity = MAX_SPEED;
let waitUntil = 0;

// export const getSpeed = () => speed;
export const setSpeed = (newSpeed: velocity) => { speed = newSpeed; };
export const getState = () => ({ isLayover: waitUntil > 0, speed, direction });

const onHaltBtnClick = () => {
  setEvent(booleanRead(HALT_BTN) ? EventTypes.BEGIN_SLOW_STOP : EventTypes.BEGIN_SLOW_START);
};

const onReverseBtnClick = () => {
  direction *= -1;
};

/** Value between 0 & `maxSpeed` */
const onSpeedChange = () => {
  speed = MAX_SPEED * (analogRead(SPEED_CONTROL) / uint10_MAX);
};

const setLayoverDuration = (length: int) => {
  if (length > 0) {
    analogWrite(LCD_TX, length / 1000);
    waitUntil = millis() + length;
  }
};

const onStationArrival = () => {
  if (getCurrentStationId() === null) {
    return;
  }

  const station = getStations().find(({ id }: { id: uint8_t}) => id === getCurrentStationId());
  if (!station) {
    return;
  }

  if (direction === DirectionTypes.NOT_SET) {
    direction = station.defaultDirection || DirectionTypes.RIGHT;
  } else if (station.reverseDirection) {
    direction *= -1;
  }
  setLayoverDuration(station.delay);
};

const pollButtons = () => {
  if (hasInputChanged(REVERSE_BTN)) {
    onReverseBtnClick();
  }

  if (hasInputChanged(HALT_BTN)) {
    onHaltBtnClick();
  }

  if (hasInputChanged(SPEED_CONTROL)) {
    onSpeedChange();
  }
};

export const loop = () => {
  pollInputs();
  pollButtons();
  pollPointSensors();

  const elapsedTime: unsigned_long = millis();

  if (elapsedTime % DASHBOARD_REFRESH_RATE === 0) {
    refreshDashboard();
  }

  if (booleanRead(PAUSE_BTN)) {
    return;
  }

  if (elapsedTime >= waitUntil && waitUntil > 0) {
    waitUntil = 0;
  }

  if (waitUntil > 0) {
    return;
  }

  switch (getTransition()) {
    case StationTransistions.ARRIVAL:
      setEvent(EventTypes.STATION_ARRIVAL);
      break;
    case StationTransistions.DEPARTURE:
      setEvent(EventTypes.STATION_DEPARTURE);
      break;
    case StationTransistions.NO_CHANGE:
      if (![
        EventTypes.CONTINUE_SPEED_CHANGE,
        EventTypes.BEGIN_SLOW_START,
        EventTypes.BEGIN_SLOW_STOP,
      ].includes(getEvent())) {
        setEvent(EventTypes.OK);
      }
      break;
  }

  switch (getEvent()) {
    case EventTypes.BEGIN_SLOW_STOP:
      slowStop(speed);
      setEvent(EventTypes.CONTINUE_SPEED_CHANGE);
      break;
    case EventTypes.BEGIN_SLOW_START:
      slowStart(speed);
      setEvent(EventTypes.CONTINUE_SPEED_CHANGE);
      break;
    case EventTypes.CONTINUE_SPEED_CHANGE:
      if (continueSpeedChange(speed)) {
        setEvent(EventTypes.OK);
      }
      break;
    case EventTypes.STATION_ARRIVAL:
      onStationArrival();
      setEvent(EventTypes.OK);
      break;
    case EventTypes.STATION_DEPARTURE:
      setEvent(EventTypes.OK);
      break;
  }

  resetChangeFlags();
};

export const setup = () => {
  Serial.begin(9600);

  ctlPinMode(HALT_BTN, INPUT);
  ctlPinMode(REVERSE_BTN, INPUT);
  ctlPinMode(SPEED_CONTROL, INPUT);

  pinMode(LCD_TX, OUTPUT);

  onSpeedChange();
};
