import { stations } from '../../configs/Stations';
import { ids, STATION_SAFETY_LENGTH } from '../../constants';
import { CSSClasses } from '../../enums';
import { JsonData, int, integer, pixels } from '../../interfaces';
import { updateStdOut } from './StdOut';

export enum StationTransistions {
  ARRIVAL = 1,
  DEPARTURE = 2,
  NO_CHANGE = 0,
}

let currentStationId: int | null = null;

const getStationByPostion = (pos: pixels) => stations.find((station: { position: int}) => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

export const getCurrentStation = () => stations.find((station: { id: int}) => station.id === currentStationId);

export const checkStations = (position: number): StationTransistions => {
  let transition = StationTransistions.NO_CHANGE;
  const station = getStationByPostion(position);
  if (station && station.id !== currentStationId) {
    transition = StationTransistions.ARRIVAL;
    currentStationId = station.id;
    const sensorEle = document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${station.id}"]`);
    sensorEle?.classList.add(CSSClasses.SENSOR_ACTIVE);

    if ((document.getElementById(ids.ENABLE_STATION_LOG) as HTMLInputElement).checked) {
      updateStdOut({
        Arrived: `${station.name} (${station.id})`,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    transition = StationTransistions.DEPARTURE;
    const sensorEle = document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${currentStationId}"]`);
    sensorEle?.classList.remove(CSSClasses.SENSOR_ACTIVE);
    if ((document.getElementById(ids.ENABLE_STATION_LOG) as HTMLInputElement).checked) {
      updateStdOut({
        // ticks,
        Departed: currentStationId,
      });
    }
    currentStationId = null;
  }

  return transition;
};

const applyStyles = (ele: HTMLElement, styles: JsonData) => {
  Object.entries(styles).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line no-param-reassign
    ele.style[key] = value;
  });
};

export const addStationsToLayout = () => {
  const layoutEle = document.getElementById(ids.LAYOUT);
  const railEle = document.getElementById(ids.RAIL);
  if (!layoutEle || !railEle) {
    throw new Error('Layout elements not found');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  stations.forEach(({ icon, name, id, position, style }: { icon: string, name: string, id: integer, position: pixels, style: JsonData}) => {
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
    updateStdOut({
      'Add Station': `${id}: "${name}"`,
      at: `${position}px (from left)`,
    });
  });
};

export const getCurrentStationId = () => currentStationId;
