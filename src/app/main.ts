// externals
import { checkStations, getCurrentStation, getCurrentStationId } from './simulator';
import { INPUT, Serial, getTicks, pinMode } from './microcontroller';
// locals
import { int, velocity } from './interfaces';
import { slowStop, slowStart, continueSpeedChange } from './libs/EaseSpeed';
import { EventTypes, getEvent, setEvent } from './libs/mgrs/EventManager';
import { refreshDashboard } from './libs/mgrs/LCDManager';
import { checkAllSensors, getCurrentStationSensor, StationTransistions } from './libs/mgrs/StationManager';
import {
  DASHBOARD_REFRESH_RATE, DirectionTypes, ENABLE_DASHBORD_LOG, ENABLE_SIGNAL_LOG, ENABLE_STATION_LOG, HALT_BTN, MAX_SPEED, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from './constants';
import { analogRead, booleanRead, hasInputChanged, resetChangeFlags } from './libs/mgrs/ControlManager';

import './styles';

let direction: DirectionTypes = DirectionTypes.NOT_SET;
/** (px/tick) current speed */
let speed: velocity = MAX_SPEED;
let waitUntil = 0;

export const getSpeed = () => speed;
export const setSpeed = (newSpeed: velocity) => { speed = newSpeed; };
export const getState = () => ({ isLayover: waitUntil > 0, speed, direction });

const onHaltBtnClick = () => {
  setEvent(booleanRead(HALT_BTN) ? EventTypes.BEGIN_SLOW_STOP : EventTypes.BEGIN_SLOW_START);
};

const onReverseBtnClick = () => {
  direction *= -1;
};

/** Percentage of `maxSpeed`, 1.0 = 100% */
const onSpeedChange = () => {
  speed = MAX_SPEED * analogRead(SPEED_CONTROL);
};

const setLayoverDuration = (length: int) => {
  if (length > 0) {
    waitUntil = getTicks() + length;
  }
};

const onStationArrival = () => {
  if (getCurrentStationId() === null) {
    return;
  }

  const station = getCurrentStation();
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

const readButtons = () => {
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
  readButtons();
  checkAllSensors();
  const sensedStation = getCurrentStationSensor();
  if (sensedStation > -1) {
    Serial.println({ 'current triggered station': sensedStation });
  }

  const ticks = getTicks();
  if (ticks % DASHBOARD_REFRESH_RATE === 0) {
    refreshDashboard();
  }

  if (booleanRead(PAUSE_BTN)) {
    return;
  }

  if (ticks >= waitUntil && waitUntil > 0) {
    waitUntil = 0;
  }

  if (waitUntil > 0) {
    return;
  }

  switch (checkStations()) {
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

  pinMode(POWER_BTN, INPUT);
  pinMode(PAUSE_BTN, INPUT);
  pinMode(HALT_BTN, INPUT);
  pinMode(REVERSE_BTN, INPUT);

  pinMode(SPEED_CONTROL, INPUT);

  pinMode(ENABLE_DASHBORD_LOG, INPUT);
  pinMode(ENABLE_SIGNAL_LOG, INPUT);
  pinMode(ENABLE_STATION_LOG, INPUT);

  onSpeedChange();
};
