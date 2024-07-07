// externals
import {
  checkStations, getCurrentStation, getCurrentStationId, hasInputChanged, analogRead,
} from './simulator';
// locals
import { int, velocity } from './interfaces';
import { slowStop, slowStart, continueSpeedChange } from './libs/EaseSpeed';
import { EventTypes, getEvent, setEvent } from './libs/mgrs/EventManager';
import { refreshDashboard } from './libs/mgrs/LCDManager';
import { StationTransistions } from './libs/mgrs/StationManager';
import {
  DASHBOARD_REFRESH_RATE, DirectionTypes, HALT_BTN, MAX_SPEED, PAUSE_BTN, POWER_BTN, REVERSE_BTN, SPEED_CONTROL,
} from './constants';
import { INPUT, Serial, getTicks, pinMode } from './microcontroller';

import './styles';

let direction: DirectionTypes = DirectionTypes.NOT_SET;
/** Percentage of `maxSpeed`, 1.0 = 100% */
let powerLevel = 1;
/** (px/tick) current speed */
let speed: velocity = MAX_SPEED;
let waitUntil = -1;

let isLayover = false;
let isPaused = false;
let isSlowHalt = false;

export const getSpeed = () => speed;
export const setSpeed = (newSpeed: velocity) => { speed = newSpeed; };
export const getState = () => ({ isLayover, isPaused, speed, direction, powerLevel, isSlowHalt });

const onPauseBtnClick = () => {
  isPaused = !isPaused;
};

const onHaltBtnClick = () => {
  isSlowHalt = !isSlowHalt;
  setEvent(isSlowHalt ? EventTypes.BEGIN_SLOW_STOP : EventTypes.BEGIN_SLOW_START);
};

const onReverseBtnClick = () => {
  direction *= -1;
};

const onSpeedChange = () => {
  powerLevel = analogRead(SPEED_CONTROL);
  speed = MAX_SPEED * powerLevel;
};

const setLayoverDuration = (length: int) => {
  if (length > 0) {
    isLayover = true;
    waitUntil = getTicks() + length;
  }
};

const handleStationArrival = () => {
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
  if (hasInputChanged(PAUSE_BTN)) {
    onPauseBtnClick();
  }

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

  const ticks = getTicks();
  if (ticks % DASHBOARD_REFRESH_RATE === 0) {
    refreshDashboard();
  }

  if (isPaused) {
    return;
  }

  if (ticks >= waitUntil && waitUntil > 0) {
    isLayover = false;
    waitUntil = -1;
  }

  if (isLayover) {
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
      handleStationArrival();
      setEvent(EventTypes.OK);
      break;
    case EventTypes.STATION_DEPARTURE:
      setEvent(EventTypes.OK);
      break;
  }
};

export const setup = () => {
  Serial.begin(9600);

  pinMode(POWER_BTN, INPUT);
  pinMode(PAUSE_BTN, INPUT);
  pinMode(HALT_BTN, INPUT);
  pinMode(REVERSE_BTN, INPUT);
  pinMode(SPEED_CONTROL, INPUT);

  onSpeedChange();
};
