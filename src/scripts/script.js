(() => {
  /* eslint-disable key-spacing, no-multi-spaces */
  const ids = {
    DSPLY_CLOCK:        'display-clock',
    DSPLY_COMMAND:      'display-command',
    DSPLY_DIRECTION:    'display-direction',
    DSPLY_POSITION:     'display-position',
    DSPLY_POWER:        'display-power',
    DSPLY_SPEED:        'display-speed',

    HALT_BTN:           'haltBtn',
    PAUSE_BTN:          'pauseBtn',
    POWER_BTN:          'powerBtn',
    REVERSE_BTN:        'reverseBtn',
    SPEED_CONTROL:      'speedControl',
    ENABLE_LOGGING:     'enableLoggingCbx',

    LAYOUT:             'layout',
    VEHICLE:            'vehicle',

    STATUS:             'display-status',
    STD_OUT:            'std-out',
  };

  const cssClasses = {
    STATUS_PAUSED:      'status--warning',
    STATUS_MOVING:      'status--success',
    STATUS_STOPPED:     'status--alert',

    ICON:               'icon',
    ICON_PREFIX:        'icon--',

    ICON_BTN_ACTIVE:    'icon-btn--active',

    STD_OUT_KEY:        'stdout__key',
    STD_OUT_VALUE:      'stdout__value',

    LEFT_ARROW:         'icon--left-arrow',
    RIGHT_ARROW:        'icon--right-arrow',
  };

  const directionUnits = {
    RIGHT: 1,
    LEFT:  -1,
  };

  const eventTypes = {
    OK:                 'ok',
    STATION_ARRIVAL:    'station:arrival',
    STATION_DEPARTURE:  'station:departure',
  };

  const CLOCK_SPEED        =    5; // ms === tick duration
  const INSTRUCTION_DELAY  =  100; // ms

  const TRAVEL_DISTANCE    =  800; // px (track length in px)
  /* eslint-enable key-spacing, no-multi-spaces */

  const stations = [{
    id: 1,
    name: 'LA Central Station',
    position: 0, // px from left
    reverseDirection: true,
    delay: 2000, // ms
    icon: 'station-1',
    defaultDirection: directionUnits.RIGHT,
    style: {
      top: '68px', left: '16px',
    },
  }, {
    id: 2,
    name: 'Claremont Station',
    position: 800, // px from left
    reverseDirection: true,
    delay: 3000, // ms
    icon: 'station-2',
    defaultDirection: directionUnits.LEFT,
    style: {
      top: '68px', right: '16px',
    },
  }, {
    id: 3,
    name: 'Burbank Platform',
    position: 400, // px from left
    reverseDirection: false,
    delay: 1500, // ms
    icon: 'passenger-platform',
    style: {
      top: '64px', right: '50%',
    },
  }, {
    id: 3,
    name: 'Atwater Crossing',
    position: 700, // px from left
    reverseDirection: false,
    delay: 750, // ms
    icon: 'crossing-signal',
    style: {
      top: '73px',
      right: '165px',
      height: '22px',
    },
  }];

  const maxSpeed = TRAVEL_DISTANCE / (6000 / CLOCK_SPEED); // px/ms
  const stationThreshold = 8; // 1.2 * maxSpeed;

  let currentEvent = eventTypes.OK;
  let currentStationId = null;
  let direction = null;
  let position = 0;
  let powerLevel = 1; // 100%
  let speed = maxSpeed;
  let ticks = 0;
  let waitUntil = -1;

  let isLayover = false;
  let isPaused = false;
  let isPowered = false;
  let isSlowHalt = false;

  const trolleyEle = document.getElementById(ids.VEHICLE);

  const updateStdOut = (message) => {
    const stdOutEle = document.getElementById(ids.STD_OUT);
    Object.entries(message).forEach(([key, value]) => {
      const keyEle = document.createElement('span');
      keyEle.textContent = key;
      keyEle.classList.add(cssClasses.STD_OUT_KEY);

      const colonEle = document.createTextNode(': ');

      const valueEle = document.createElement('span');
      valueEle.classList.add(cssClasses.STD_OUT_VALUE);
      valueEle.textContent = value;

      const spaceEle = document.createTextNode(' ');

      stdOutEle.appendChild(keyEle);
      stdOutEle.appendChild(colonEle);
      stdOutEle.appendChild(valueEle);
      stdOutEle.appendChild(spaceEle);
    });

    const lineBreakEle = document.createElement('br');
    stdOutEle.appendChild(lineBreakEle);
  };

  const getStationByPostion = pos => stations.find(station => (pos > (station.position - stationThreshold) && pos < (station.position + stationThreshold)));

  const getCurrentStation = () => stations.find(station => station.id === currentStationId);

  const checkStations = () => {
    const station = getStationByPostion(position);
    if (station && station.id !== currentStationId) {
      currentEvent = eventTypes.STATION_ARRIVAL;
      currentStationId = station.id;
      updateStdOut({
        ticks,
        Arrived: station.name,
        layover: station.delay || 'none',
      });
    } else if (!station && currentStationId !== null) {
      currentEvent = eventTypes.STATION_DEPARTURE;
      updateStdOut({
        ticks,
        Departed: currentStationId,
      });
      currentStationId = null;
    } else {
      currentEvent = eventTypes.OK;
    }
  };

  const moveTrolley = () => {
    if (isLayover || !isPowered || isPaused || currentEvent !== eventTypes.OK) {
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
    this.classList.toggle(cssClasses.ICON_BTN_ACTIVE, isPaused);
  }

  function onHaltBtnClick() {
    isSlowHalt = !isSlowHalt;
    this.classList.toggle(cssClasses.ICON_BTN_ACTIVE, isSlowHalt);
  }

  function onPowerBtnClick() {
    isPowered = !isPowered;
    this.classList.toggle(cssClasses.ICON_BTN_ACTIVE, isPowered);
    if (!isPowered) {
      ticks = 0;
    }
  }

  const onReverseBtnClick = () => {
    direction *= -1;
  };

  function onSpeedChange() {
    powerLevel = this.value / 100;
    speed = maxSpeed * powerLevel;
  }

  const updateClock = () => {
    document.getElementById(ids.DSPLY_CLOCK).value = ticks;
  };

  const setStatusLED = () => {
    // eslint-disable-next-line no-nested-ternary
    const statusClass = !isPowered
      ? cssClasses.STATUS_STOPPED
      : (isLayover || isPaused ? cssClasses.STATUS_PAUSED : cssClasses.STATUS_MOVING);
    const ledEle = document.getElementById(ids.STATUS);
    ledEle.classList.remove(cssClasses.STATUS_PAUSED, cssClasses.STATUS_MOVING, cssClasses.STATUS_STOPPED);
    ledEle.classList.add(statusClass);
  };

  const updateDashboard = () => {
    setStatusLED();
    const currentState = {
      ticks,
      action: isLayover || isPaused ? 'Pause' : 'Move',
      direction: direction === directionUnits.RIGHT ? 'Right' : 'Left',
      position: position.toFixed(1),
      power: `${(powerLevel * 100).toFixed(1)}%`,
      // eslint-disable-next-line no-mixed-operators
      maxSpeed: `${(1000 * maxSpeed / CLOCK_SPEED).toFixed(1)} px/s`,
    };

    const directionEle = document.getElementById(ids.DSPLY_DIRECTION);
    directionEle.classList.toggle(cssClasses.LEFT_ARROW, direction === directionUnits.LEFT);
    directionEle.classList.toggle(cssClasses.RIGHT_ARROW, direction === directionUnits.RIGHT);

    document.getElementById(ids.DSPLY_COMMAND).value = currentState.action;
    document.getElementById(ids.DSPLY_POSITION).value = currentState.position;
    document.getElementById(ids.DSPLY_POWER).value = currentState.power;
    document.getElementById(ids.DSPLY_SPEED).value = currentState.maxSpeed;

    if (document.getElementById(ids.ENABLE_LOGGING).checked) {
      updateStdOut(currentState);
    }
  };

  const addStationsToLayout = () => {
    const layoutEle = document.getElementById(ids.LAYOUT);
    stations.forEach((station) => {
      const stationEle = document.createElement('span');
      stationEle.classList.add(cssClasses.ICON, `${cssClasses.ICON_PREFIX}${station.icon}`);
      Object.entries(station.style).forEach(([key, value]) => {
        stationEle.style[key] = value;
      });
      stationEle.title = station.name;
      stationEle.dataset.stationId = station.id;
      layoutEle.appendChild(stationEle);
    });
  };

  const setLayoverDuration = (length) => {
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
    if (direction === null) {
      direction = station.defaultDirection || directionUnits.RIGHT;
    } else if (station.reverseDirection) {
      direction *= -1;
    }
    setLayoverDuration(station.delay);
  };

  const attachEventListeners = () => {
    document.getElementById(ids.HALT_BTN).addEventListener('click', onHaltBtnClick);
    document.getElementById(ids.PAUSE_BTN).addEventListener('click', onPauseBtnClick);
    document.getElementById(ids.POWER_BTN).addEventListener('click', onPowerBtnClick);
    document.getElementById(ids.REVERSE_BTN).addEventListener('click', onReverseBtnClick);
    document.getElementById(ids.SPEED_CONTROL).addEventListener('input', onSpeedChange);
  };

  const loop = () => {
    if (!isPowered) {
      return;
    }

    updateClock();

    if (ticks % INSTRUCTION_DELAY === 0) {
      updateDashboard();
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
      case eventTypes.STATION_ARRIVAL:
        handleStationArrival();
        break;
    }

    moveTrolley();

    currentEvent = eventTypes.OK;
    ticks++;
  };

  const setup = () => {
    addStationsToLayout();
    attachEventListeners();
    onSpeedChange.call(document.getElementById(ids.SPEED_CONTROL));
    setInterval(loop, CLOCK_SPEED);
  };

  setup();
})();
