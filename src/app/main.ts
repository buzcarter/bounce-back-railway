import { CLOCK_SPEED, DASHBOARD_REFRESH_RATE, MIN_TIME_TO_COMPLETE, TRAVEL_DISTANCE } from "./constants/Constants";
import { clockTick, int, velocity } from "./interfaces/CoreTypes";
import { DirectionTypes } from "./interfaces/DirectionTypes";
import { setStatusLED, updateClock, updateDashboard } from "./libs/Dashboard";
import { slowStop, slowStart, continueSpeedChange } from "./libs/EaseSpeed";
import { EventTypes, get as getEvent, set as setEvent } from "./libs/EventManager";
import { PinAssignments, setupSlider, readValue, hasInputChanged, setupBtn } from "./libs/PinAssignments";
import { StationTransistions, addStationsToLayout, checkStations, getCurrentStation, getCurrentStationId } from "./libs/StationsHelper";
import { getPosition, moveTrolley, resetTrolleyPosition } from "./libs/Trolley";
import './styles';

/** (px/tick) */
const maxSpeed: velocity = TRAVEL_DISTANCE / (MIN_TIME_TO_COMPLETE / CLOCK_SPEED);

let direction: DirectionTypes = DirectionTypes.NOT_SET;
/** Percentage of `maxSpeed`, 1.0 = 100% */
let powerLevel = 1;
/** (px/tick) current speed */
let speed: velocity = maxSpeed;
let ticks: clockTick = 0;
let waitUntil = -1;

let isLayover = false;
let isPaused = false;
let isPowered = false;
let isSlowHalt = false;

export const getSpeed = () => speed;
export const setSpeed = (newSpeed: velocity) => speed = newSpeed;

const onPauseBtnClick = () => {
  isPaused = !isPaused;
}

const onHaltBtnClick = () => {
  isSlowHalt = !isSlowHalt;
  setEvent(isSlowHalt ? EventTypes.BEGIN_SLOW_STOP : EventTypes.BEGIN_SLOW_START);
}

const onPowerBtnClick = () => {
  isPowered = !isPowered;
  if (!isPowered) {
    ticks = 0;
  }
}

const onReverseBtnClick = () => {
  direction *= -1;
};

const onSpeedChange = () => {
  powerLevel = readValue(PinAssignments.SPEED_CONTROL);
  speed = maxSpeed * powerLevel;
}

const setLayoverDuration = (length: int) => {
  if (length > 0) {
    isLayover = true;
    waitUntil = ticks + (length / CLOCK_SPEED);
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

  if (hasInputChanged(PinAssignments.POWER_BTN)) {
    onPowerBtnClick();
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

const loop = () => {
  readButtons();

  if (!isPowered) {
    return;
  }

  updateClock(ticks);

  let position = getPosition();
  if (ticks % DASHBOARD_REFRESH_RATE === 0) {
    setStatusLED({ isPowered, isSlowHalt, isLayover, isPaused });
    updateDashboard({ ticks, isLayover, isPaused, direction, position, powerLevel, speed, maxSpeed });
  }

  if (isPaused) {
    ticks++;
    return;
  }

  if (ticks >= waitUntil && waitUntil > 0) {
    isLayover = false;
    waitUntil = -1;
  }

  if (isLayover) {
    ticks++;
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

  moveTrolley({ isLayover, isPaused, isPowered, speed, direction });

  ticks++;
};

const setup = () => {
  addStationsToLayout();
  resetTrolleyPosition();

  setupBtn(PinAssignments.HALT_BTN);
  setupBtn(PinAssignments.PAUSE_BTN);
  setupBtn(PinAssignments.POWER_BTN);
  setupBtn(PinAssignments.REVERSE_BTN);
  setupSlider(PinAssignments.SPEED_CONTROL, 50.0);

  onSpeedChange();

  setInterval(loop, CLOCK_SPEED);
};

setup();
