import { stations } from "../StationsSetup";
import { STATION_SAFETY_LENGTH } from "../constants/Constants";
import { ids } from "../constants/ElementIds";
import { CSSClasses } from "../interfaces/CSSClasses";
import { int, pixels } from "../interfaces/CoreTypes";
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
    updateStdOut({
      // ticks,
      Arrived: station.name,
      layover: station.delay || 'none',
    });
  } else if (!station && currentStationId !== null) {
    setEvent(EventTypes.STATION_DEPARTURE);
    updateStdOut({
      // ticks,
      Departed: currentStationId,
    });
    currentStationId = null;
  } else {
    setEvent(EventTypes.OK);
  }
  return currentStationId;
};

export const addStationsToLayout = () => {
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

export const getCurrentStationId = () => currentStationId;
