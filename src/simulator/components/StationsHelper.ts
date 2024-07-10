// externals
import { getStations } from '../../configs/StationUtils';
import { JsonData, uint8_t } from '../../app/interfaces';
// locals
import { CSSClasses, ElementIds } from '../constants';
import { updateStdOut } from './StdOut';

export const setActive = (stationId: uint8_t, isActive: boolean) => {
  document.querySelector(`.${CSSClasses.SENSOR}[data-sensor-for-station="${stationId}"]`)?.classList.toggle(CSSClasses.SENSOR_ACTIVE, isActive);
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