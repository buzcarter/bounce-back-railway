import { stations } from "../StationsSetup";
import { STATION_SAFETY_LENGTH } from "../constants/Constants";
import { ids } from "../constants/ElementIds";
import { CSSClasses } from "../interfaces/CSSClasses";
import { JsonData, int, pixels } from "../interfaces/CoreTypes";
import { EventTypes } from "../interfaces/EventTypes";
import { set as setEvent, get as getEvent } from "./EventManager";
import { updateStdOut } from "./StdOut";

let currentStationId: int | null = null;

const getStationByPostion = (pos: pixels) => stations.find(station => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

export const getCurrentStation = () => stations.find(station => station.id === currentStationId);

export const checkStations = (position: number): int | null => {
  const station = getStationByPostion(position);
  if (station && station.id !== currentStationId) {
    setEvent(EventTypes.STATION_ARRIVAL);
    currentStationId = station.id;
    const sensorEle = document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${station.id}"]`);
    sensorEle?.classList.add(CSSClasses.SENSOR_ACTIVE);

    if ((document.getElementById(ids.ENABLE_STATION_LOG) as HTMLInputElement).checked) {
      updateStdOut({
        // ticks,
        Arrived: station.name,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    setEvent(EventTypes.STATION_DEPARTURE);
    const sensorEle = document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${currentStationId}"]`);
    sensorEle?.classList.remove(CSSClasses.SENSOR_ACTIVE);
    if ((document.getElementById(ids.ENABLE_STATION_LOG) as HTMLInputElement).checked) {
      updateStdOut({
        // ticks,
        Departed: currentStationId,
      });
    }
    currentStationId = null;
  } else {
    setEvent(EventTypes.OK);
  }
  return currentStationId;
};

const applyStyles = (ele: HTMLElement, styles: JsonData) => {
  Object.entries(styles).forEach(([key, value]) => {
    // @ts-ignore-next-line
    ele.style[key] = value;
  });
}

export const addStationsToLayout = () => {
  const layoutEle = document.getElementById(ids.LAYOUT);
  const railEle = document.getElementById(ids.RAIL);
  if (!layoutEle || !railEle) {
    throw new Error('Layout elements not found');
  }

  stations.forEach(({ icon, name, id, position, style }) => {
    const stationEle = document.createElement('span');
    stationEle.classList.add(CSSClasses.ICON, `${CSSClasses.ICON_PREFIX}${icon}`);
    stationEle.title = name;
    stationEle.dataset.stationId = id as unknown as string;
    applyStyles(stationEle, style as unknown as JsonData);

    layoutEle.appendChild(stationEle);

    const sensorEle = document.createElement('span');
    sensorEle.classList.add(CSSClasses.SENSOR);
    sensorEle.style.left = `${position}px`;
    sensorEle.dataset.sensorForStation = id as unknown as string;
    sensorEle.dataset.position = position.toString();
    sensorEle.title = name;

    railEle.appendChild(sensorEle);
  });
};

export const getCurrentStationId = () => currentStationId;
