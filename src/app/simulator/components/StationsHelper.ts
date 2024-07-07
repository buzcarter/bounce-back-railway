// externals
import { stations } from '../../configs/Stations';
import { STATION_SAFETY_LENGTH } from '../../constants';
import { StationTransistions } from '../../libs/mgrs/StationManager';
import { JsonData, int, integer, pixels } from '../../interfaces';
// locals
import { CSSClasses, ids } from '../constants';
import { updateStdOut } from './StdOut';
import { getPosition } from './Trolley';
import { SensorTypes } from '../../constants/SensorTypes';

let currentStationId: int | null = null;

export const getSignals = () => stations.filter(({ type }: { type: SensorTypes}) => type === SensorTypes.SIGNAL);
export const getStations = () => stations.filter(({ type }: { type: SensorTypes}) => type === SensorTypes.STATION);
export const getCurrentStation = () => getStations().find((station: { id: int}) => station.id === currentStationId);

const getStationByPostion = (pos: pixels) => getStations().find((station: { position: int}) => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

const setActiveIndicator = (stationId: int, isActive: boolean) => {
  document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${stationId}"]`)?.classList.toggle(CSSClasses.SENSOR_ACTIVE, isActive);
};

export const checkStations = (): StationTransistions => {
  const position = getPosition();
  let transition = StationTransistions.NO_CHANGE;
  const station = getStationByPostion(position);
  if (station && station.id !== currentStationId) {
    transition = StationTransistions.ARRIVAL;
    currentStationId = station.id;
    setActiveIndicator(station.id, true);

    if ((document.getElementById(ids.ENABLE_STATION_LOG) as HTMLInputElement).checked) {
      updateStdOut({
        Arrived: `${station.name} (${station.id})`,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    transition = StationTransistions.DEPARTURE;
    setActiveIndicator(currentStationId, false);
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

  getStations()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .forEach(({ icon, name, id, position, style }: { icon: string, name: string, id: integer, position: pixels, style: JsonData}) => {
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
