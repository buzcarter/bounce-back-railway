interface ColorCodeTypes {
  color: string,
  threshold: number,
}

class CountdownTimer {
  /**
   * Creates a new CountdownTimer instance. The timer is rendered in the container element with the specified ID.
   * Callback function is called when the timer is done.
   * Call the start method to start the timer.
   * Call the set method to set (reset) a new duration for the timer.
   *
   * @constructor
   * @param {Object} options - The options for the countdown timer.
   * @param {string} options.containerId - The ID of the container element.
   * @param {number} [options.timerDuration=20] - The duration of the timer in seconds.
   * @param {number} [options.clockSpeed=100] - The speed of the clock in milliseconds.
   * @param {number} [options.boxSize=100] - The size of the timer box in pixels.
   * @param {number} [options.radius=45] - The radius of the timer circle in pixels.
   * @param {number} [options.lineWidth=7] - The width of the timer circle's stroke in pixels.
   * @param {Function} [options.onDone] - The callback function to be called when the timer is done.
   */
  constructor(
    { containerId, timerDuration, clockSpeed, boxSize, radius, lineWidth, onDone }:
    { containerId: string, timerDuration?: number, clockSpeed?: number, boxSize?: number, radius?: number, lineWidth?: number, onDone?: (containerId: string, timerDuration: number) => void },
  ) {
    this.onDone = onDone;
    this.containerId = containerId;
    this.timerDuration = timerDuration || 20;
    this.clockSpeed = clockSpeed || 100;

    this.layout = {
      boxSize: boxSize || 100,
      radius: radius || 45,
      lineWidth: lineWidth || 7,
      pathLength: 0,
    };

    this.layout.pathLength = Math.round(2 * Math.PI * this.layout.radius);

    this.#render();
  }

  onDone?: (containerId: string, timerDuration: number) => void;

  containerId: string = '';

  timerDuration: number = 20;

  clockSpeed: number = 100;

  svgPathEle: HTMLElement | null = null;

  timeRemainingEle: HTMLElement | null = null;

  layout: {
    boxSize: number,
    radius: number,
    lineWidth: number,
    pathLength: number,
  };

  static #getColorCodes(timerDuration: number): {
    info: ColorCodeTypes,
    warning: ColorCodeTypes,
    alert: ColorCodeTypes,
  } {
    return {
      info: {
        color: 'green',
        threshold: 0,
      },
      // at 50% of the time remaining, change to warning color
      warning: {
        color: 'orange',
        threshold: timerDuration / 2,
      },
      // at 25% of the time remaining, change to alert color
      alert: {
        color: 'red',
        threshold: timerDuration / 4,
      },
    };
  }

  static #formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // Ensure that single digit seconds are preceded with a zero
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(1)}`;
  }

  #getMarkup(pathID: string, labelID: string, pathColorClass: string, initialTime: number) {
    const { boxSize, radius, lineWidth, pathLength } = this.layout;
    const center = boxSize / 2;

    const pathDefinition = ''
      + `M ${center}, ${center} ` // Move to center
      + `m -${radius}, 0 ` // Relative move to the left
      + `a ${radius},${radius} 0 1,0 ${2 * radius},0 ` // Arc to the right
      + `a ${radius},${radius} 0 1,0 -${2 * radius},0 `; // Arc to the left

    return ''
      + `<div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 ${boxSize} ${boxSize}" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="${center}" cy="${center}" r="${radius}" style="stroke-width: ${lineWidth}px;" />
          <path id="${pathID}" stroke-dasharray="${pathLength}"
            class="base-timer__path-remaining ${pathColorClass}"
            style="stroke-width: ${lineWidth}px; transition: stroke-dasharray ${this.clockSpeed / 1000}s linear 0s, color ${(initialTime / 8).toFixed(2)}s linear 0s"
            d="${pathDefinition}" />
        </g>
      </svg>
      <span id="${labelID}" class="base-timer__label">${CountdownTimer.#formatTime(initialTime)}</span>
    </div>`;
  }

  static #setRemainingPathColor(svgPathEle: HTMLElement, remainingTime: number, { alert, warning, info }: { alert: ColorCodeTypes, warning: ColorCodeTypes, info: ColorCodeTypes } = {
    alert: { color: '', threshold: 0 },
    warning: { color: '', threshold: 0 },
    info: { color: '', threshold: 0 },
  }) {
    if (remainingTime <= alert.threshold && !svgPathEle.classList.contains(alert.color)) {
      svgPathEle.classList.add(alert.color);
      svgPathEle.classList.remove(warning.color);
    } else if (remainingTime <= warning.threshold && !svgPathEle.classList.contains(warning.color)) {
      svgPathEle.classList.add(warning.color);
      svgPathEle.classList.remove(info.color);
    }
  }

  #render() {
    const { timerDuration, containerId } = this;

    const containerEle = document.getElementById(containerId);
    if (!containerEle) {
      throw new Error(`Element with ID ${containerId} not found.`);
    }

    const svgPathID = `base-timer-path-remaining-${containerId}`;
    const labelID = `base-timer-label-${containerId}`;
    const colorCodes = CountdownTimer.#getColorCodes(timerDuration);

    containerEle.innerHTML = this.#getMarkup(svgPathID, labelID, colorCodes.info.color, timerDuration);

    this.svgPathEle = document.getElementById(svgPathID);
    this.timeRemainingEle = document.getElementById(labelID);
  }

  set(duration: number) {
    this.timerDuration = duration;
    this.#render();
  }

  start() {
    const {
      clockSpeed, timerDuration, timeRemainingEle, svgPathEle,
      layout: { pathLength },
    } = this;

    const pixelsPerTick = pathLength / ((1000 * timerDuration) / clockSpeed);
    const colorCodes = CountdownTimer.#getColorCodes(timerDuration);

    let remainingPathLength = pathLength;
    let elapsedTime = 0;
    let remainingTime = timerDuration;
    let timerInterval: NodeJS.Timeout;

    const onTick = () => {
      elapsedTime += clockSpeed / 1000;
      remainingTime = timerDuration - elapsedTime;
      remainingPathLength -= pixelsPerTick;

      svgPathEle!.setAttribute('stroke-dasharray', `${remainingPathLength.toFixed(1)} ${pathLength}`);
      CountdownTimer.#setRemainingPathColor(svgPathEle as unknown as HTMLElement, remainingTime, colorCodes);
      timeRemainingEle!.innerText = CountdownTimer.#formatTime(remainingTime);

      if (remainingTime <= 0) {
        timeRemainingEle!.innerText = CountdownTimer.#formatTime(0);
        svgPathEle!.setAttribute('stroke-dasharray', `-1 ${pathLength}`);
        clearInterval(timerInterval);

        if (typeof this.onDone === 'function') {
          this.onDone(this.containerId, timerDuration);
        }
      }
    };

    timerInterval = setInterval(onTick, clockSpeed);
  }
}

export default CountdownTimer;
