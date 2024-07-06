import {
  StationTransistions, checkStations, getCurrentStation, getCurrentStationId,
  setStatusLED, updateClock, updateDashboard,
  getPosition,
} from "./libs/Simulator";
import {
  int, velocity,
 } from "./interfaces";
import {
  PinAssignments, DirectionTypes
} from "./enums";
import {
  DASHBOARD_REFRESH_RATE, MAX_SPEED,
} from "./constants";
import { slowStop, slowStart, continueSpeedChange } from "./libs/EaseSpeed";
import { EventTypes, get as getEvent, set as setEvent } from "./libs/Managers/EventManager";
import { readValue, hasInputChanged } from "./libs/Simulator/UXControls";
import { getTicks } from "./libs/System/Clock";
import { getIsPowered } from "./libs/System/Power";

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
export const setSpeed = (newSpeed: velocity) => speed = newSpeed;
export const getState = () => ({ isLayover, isPaused, speed, direction });

const onPauseBtnClick = () => {
  isPaused = !isPaused;
}

const onHaltBtnClick = () => {
  isSlowHalt = !isSlowHalt;
  setEvent(isSlowHalt ? EventTypes.BEGIN_SLOW_STOP : EventTypes.BEGIN_SLOW_START);
}

const onReverseBtnClick = () => {
  direction *= -1;
};

const onSpeedChange = () => {
  powerLevel = readValue(PinAssignments.SPEED_CONTROL);
  speed = MAX_SPEED * powerLevel;
}

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
  if (hasInputChanged(PinAssignments.PAUSE_BTN)) {
    onPauseBtnClick()
  }

  if (hasInputChanged(PinAssignments.REVERSE_BTN)) {
    onReverseBtnClick();
  }

  if (hasInputChanged(PinAssignments.HALT_BTN)) {
    onHaltBtnClick();
  }

  if (hasInputChanged(PinAssignments.SPEED_CONTROL)) {
    onSpeedChange();
  }
}

export const loop = () => {
  readButtons();

  const ticks = getTicks();
  updateClock(ticks);

  let position = getPosition();
  if (ticks % DASHBOARD_REFRESH_RATE === 0) {
    setStatusLED({ isPowered: getIsPowered(), isSlowHalt, isLayover, isPaused });
    updateDashboard({ ticks, isLayover, isPaused, direction, position, powerLevel, speed, maxSpeed: MAX_SPEED });
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

  switch (checkStations(position)) {
    case StationTransistions.ARRIVAL:
      setEvent(EventTypes.STATION_ARRIVAL);
      break;
    case StationTransistions.DEPARTURE:
      setEvent(EventTypes.STATION_DEPARTURE);
      break
    case StationTransistions.NO_CHANGE:
      if (![
        EventTypes.CONTINUE_SPEED_CHANGE,
        EventTypes.BEGIN_SLOW_START,
        EventTypes.BEGIN_SLOW_STOP
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
  onSpeedChange();
};
