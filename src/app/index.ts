import { CLOCK_SPEED, DASHBOARD_REFRESH_RATE, HALT_DURATION, MIN_TIME_TO_COMPLETE, TRAVEL_DISTANCE } from "./constants/Constants";
import { clockTick, int, pixels, velocity } from "./interfaces/CoreTypes";
import { DirectionTypes } from "./interfaces/DirectionTypes";
import { EventTypes } from "./interfaces/EventTypes";
import { setStatusLED, updateClock, updateDashboard } from "./libs/Dashboard";
import { get as getEvent, set as setEvent } from "./libs/EventManager";
import { PinAssignments, setupSlider, readValue, hasInputChanged, setupBtn } from "./libs/PinAssignments";
import { addStationsToLayout, checkStations, getCurrentStation, getCurrentStationId } from "./libs/StationsHelper";
import { getPosition, moveTrolley } from "./libs/Trolley";

/** (px/tick) */
const maxSpeed: velocity = TRAVEL_DISTANCE / (MIN_TIME_TO_COMPLETE / CLOCK_SPEED);

let direction: DirectionTypes = DirectionTypes.NOT_SET;
/** Percentage of `maxSpeed`, 1.0 = 100% */
let powerLevel = 1;
/** (px/tick) current speed */
let speed:velocity = maxSpeed;
/** (px/tick) used for Halt/Slow Stop */
let originalSpeed: velocity = speed;
let ticks: clockTick = 0;
let waitUntil = -1;

let isLayover = false;
let isPaused = false;
let isPowered = false;
let isSlowHalt = false;

// hack to silence TS, so it's never null

function onPauseBtnClick() {
  isPaused = !isPaused;
}

function onHaltBtnClick() {
  isSlowHalt = !isSlowHalt;
  if (isSlowHalt) {
    originalSpeed = speed;
  }

  let currentStep = 0;
  const nbrSteps = HALT_DURATION / CLOCK_SPEED;
  const stepSize = originalSpeed / nbrSteps;
  const handle = setInterval(() => {
    if (currentStep++ >= nbrSteps) {
      clearInterval(handle);
      speed = isSlowHalt ? 0 : originalSpeed;
      return;
    }

    speed += (isSlowHalt ? -1 : 1) * stepSize;
  }, CLOCK_SPEED);
}

function onPowerBtnClick() {
  isPowered = !isPowered;
  if (!isPowered) {
    ticks = 0;
  }
}

const onReverseBtnClick = () => {
  direction *= -1;
};

function onSpeedChange() {
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

  checkStations(position);

  switch (getEvent()) {
    case EventTypes.STATION_ARRIVAL:
      handleStationArrival();
      break;
  }

  moveTrolley({ isLayover, isPaused, isPowered, speed, direction });

  setEvent(EventTypes.OK);
  ticks++;
};

const setup = () => {
  addStationsToLayout();

  setupBtn(PinAssignments.HALT_BTN);
  setupBtn(PinAssignments.PAUSE_BTN);
  setupBtn(PinAssignments.POWER_BTN);
  setupBtn(PinAssignments.REVERSE_BTN);
  setupSlider(PinAssignments.SPEED_CONTROL, 50.0);

  onSpeedChange();

  setInterval(loop, CLOCK_SPEED);
};

setup();
