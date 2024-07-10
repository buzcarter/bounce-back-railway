import { SensorTypes } from '../constants';
import { stations } from './Stations';

const getByType = (filterType: SensorTypes) => stations.filter(({ type }: { type: SensorTypes}) => type === filterType);
export const getSignals = getByType.bind(null, SensorTypes.SIGNAL);
export const getStations = getByType.bind(null, SensorTypes.STATION);
