import { CLOCK_SPEED, DASHBOARD_REFRESH_RATE, HALT_DURATION, MIN_TIME_TO_COMPLETE, TRAVEL_DISTANCE } from "./constants/Constants";
import { CSSClasses } from "./interfaces/CSSClasses";
import { clockTick, int, pixels, velocity } from "./interfaces/CoreTypes";
import { DirectionTypes } from "./interfaces/DirectionTypes";
import { stations } from "./StationsSetup";
import { updateStdOut } from "./libs/StdOut";
import { EventTypes } from "./interfaces/EventTypes";
import { ids } from "./constants/ElementIds";
import { updateDashboard } from "./libs/Dashboard";

/** (px/tick) */
const maxSpeed: velocity = TRAVEL_DISTANCE / (MIN_TIME_TO_COMPLETE / CLOCK_SPEED);
/** (ms) */
const stationThreshold: pixels = 8;

let currentEvent: EventTypes = EventTypes.OK;
let currentStationId: int | null = null;
let direction: DirectionTypes = DirectionTypes.LEFT;
/** (px) */
let position: pixels = 0;
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
const trolleyEle = document.getElementById(ids.VEHICLE) || document.createElement('div');

const getStationByPostion = (pos: pixels) => stations.find(station => (pos > (station.position - stationThreshold) && pos < (station.position + stationThreshold)));

const getCurrentStation = () => stations.find(station => station.id === currentStationId);

const checkStations = () => {
  const station = getStationByPostion(position);
  if (station && station.id !== currentStationId) {
    currentEvent = EventTypes.STATION_ARRIVAL;
    currentStationId = station.id;
    updateStdOut({
      ticks,
      Arrived: station.name,
      layover: station.delay || 'none',
    });
  } else if (!station && currentStationId !== null) {
    currentEvent = EventTypes.STATION_DEPARTURE;
    updateStdOut({
      ticks,
      Departed: currentStationId,
    });
    currentStationId = null;
  } else {
    currentEvent = EventTypes.OK;
  }
};

const moveTrolley = () => {
  if (isLayover || !isPowered || isPaused || currentEvent !== EventTypes.OK) {
    return;
  }
  position += speed * direction;
  if (position <= 0 || position >= TRAVEL_DISTANCE) {
    throw new Error('CRASH!!!');
  }
  trolleyEle.style.left = `${position}px`;
};

function onPauseBtnClick() {
  isPaused = !isPaused;
    // @ts-ignore-next-line
  (this as HTMLInputElement).type = isPaused ? 'button' : 'submit';
    // @ts-ignore-next-line
  this.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, isPaused);
}

function onHaltBtnClick() {
  isSlowHalt = !isSlowHalt;
    // @ts-ignore-next-line
  this.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, isSlowHalt);
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
    // @ts-ignore-next-line
  this.classList.toggle(CSSClasses.ICON_BTN_ACTIVE, isPowered);
  if (!isPowered) {
    ticks = 0;
  }
}

const onReverseBtnClick = () => {
  direction *= -1;
};

function onSpeedChange() {
    // @ts-ignore-next-line
  powerLevel = this.value / 100;
  speed = maxSpeed * powerLevel;
}

const updateClock = () => {
  (document.getElementById(ids.DSPLY_CLOCK) as HTMLInputElement).value = ticks as unknown as string;
};

const setStatusLED = () => {
  // eslint-disable-next-line no-nested-ternary
  const statusClass = (!isPowered || isSlowHalt)
    ? CSSClasses.STATUS_STOPPED
    : (isLayover || isPaused ? CSSClasses.STATUS_PAUSED : CSSClasses.STATUS_MOVING);
  const ledEle = document.getElementById(ids.STATUS);
  ledEle!.classList.remove(CSSClasses.STATUS_PAUSED, CSSClasses.STATUS_MOVING, CSSClasses.STATUS_STOPPED);
  ledEle!.classList.add(statusClass);
};

const addStationsToLayout = () => {
  const layoutEle = document.getElementById(ids.LAYOUT);
  stations.forEach((station) => {
    const stationEle = document.createElement('span');
    stationEle.classList.add(CSSClasses.ICON, `${CSSClasses.ICON_PREFIX}${station.icon}`);
    Object.entries(station.style).forEach(([key, value]) => {
    // @ts-ignore-next-line
      stationEle.style[key] = value;
    });
    stationEle.title = station.name;
    stationEle.dataset.stationId = station.id as unknown as string;
    layoutEle!.appendChild(stationEle);
  });
};

const setLayoverDuration = (length: int) => {
  if (length > 0) {
    isLayover = true;
    waitUntil = ticks + (length / CLOCK_SPEED);
  }
};

const handleStationArrival = () => {
  if (currentStationId === null) {
    return;
  }

  const station = getCurrentStation();
  if (!station) {
    return;
  }

  if (direction === null) {
    direction = station.defaultDirection || DirectionTypes.RIGHT;
  } else if (station.reverseDirection) {
    direction *= -1;
  }
  setLayoverDuration(station.delay);
};

const attachEventListeners = () => {
  document.getElementById(ids.HALT_BTN)!.addEventListener('click', onHaltBtnClick);
  document.getElementById(ids.PAUSE_BTN)!.addEventListener('click', onPauseBtnClick);
  document.getElementById(ids.POWER_BTN)!.addEventListener('click', onPowerBtnClick);
  document.getElementById(ids.REVERSE_BTN)!.addEventListener('click', onReverseBtnClick);
  document.getElementById(ids.SPEED_CONTROL)!.addEventListener('input', onSpeedChange);
};

const loop = () => {
  if (!isPowered) {
    return;
  }

  updateClock();

  if (ticks % DASHBOARD_REFRESH_RATE === 0) {
    setStatusLED();
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

  checkStations();

  switch (currentEvent) {
    case EventTypes.STATION_ARRIVAL:
      handleStationArrival();
      break;
  }

  moveTrolley();

  currentEvent = EventTypes.OK;
  ticks++;
};

const setup = () => {
  addStationsToLayout();
  attachEventListeners();
  onSpeedChange.call(document.getElementById(ids.SPEED_CONTROL));
  setInterval(loop, CLOCK_SPEED);
};

setup();
