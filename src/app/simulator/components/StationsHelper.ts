// externals
import { stations } from '../../configs/Stations';
import { StationTransistions } from '../../libs/mgrs/StationManager';
import { JsonData, int, pixels } from '../../interfaces';
// locals
import { CSSClasses, ElementIds, STATION_SAFETY_LENGTH } from '../constants';
import { updateStdOut } from './StdOut';
import { getPosition } from './TrolleyUI';
import { STATION_CHBX, SENSOR_VOLTS_ALL_CLEAR, SENSOR_VOLTS_OBJECT_DETECTED, SensorTypes } from '../../constants';
import { analogWrite, booleanRead } from '../../libs/mgrs/ControlManager';

let currentStationId: int | null = null;

const getByType = (filterType: SensorTypes) => stations.filter(({ type }: { type: SensorTypes}) => type === filterType);
export const getSignals = getByType.bind(null, SensorTypes.SIGNAL);
export const getStations = getByType.bind(null, SensorTypes.STATION);
export const getCurrentStation = () => getStations().find((station: { id: int}) => station.id === currentStationId);

const getStationByPostion = (pos: pixels) => getStations().find((station: { position: int}) => (pos > (station.position - STATION_SAFETY_LENGTH) && pos < (station.position + STATION_SAFETY_LENGTH)));

const setActive = (stationId: int, isActive: boolean) => {
  document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${stationId}"]`)?.classList.toggle(CSSClasses.SENSOR_ACTIVE, isActive);
};

export const checkStations = (): StationTransistions => {
  const position = getPosition();
  let transition = StationTransistions.NO_CHANGE;
  const station = getStationByPostion(position);
  if (station && station.id !== currentStationId) {
    transition = StationTransistions.ARRIVAL;
    currentStationId = station.id;
    setActive(station.id, true);
    analogWrite(station.id, SENSOR_VOLTS_OBJECT_DETECTED);
    if (booleanRead(STATION_CHBX)) {
      updateStdOut({
        Arrived: `${station.name} (${station.id})`,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    transition = StationTransistions.DEPARTURE;
    setActive(currentStationId, false);
    analogWrite(currentStationId, SENSOR_VOLTS_ALL_CLEAR);
    if (booleanRead(STATION_CHBX)) {
      updateStdOut({
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
  const layoutEle = document.getElementById(ElementIds.LAYOUT);
  const railEle = document.getElementById(ElementIds.RAIL);
  if (!layoutEle || !railEle) {
    throw new Error('Layout elements not found');
  }

  getStations()
    .forEach((station) => {
      const {
        id, name, position, icon, style,
      } = station;
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
