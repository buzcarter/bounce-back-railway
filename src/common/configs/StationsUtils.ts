import { SensorTypes } from '../constants/SensorTypes';
import { uint8_t } from '../interfaces/CoreTypes';
import { stations } from './Stations';

const getByType = (filterType: SensorTypes) => stations.filter(({ type }: { type: SensorTypes}) => type === filterType);

export const getSignals = getByType.bind(null, SensorTypes.SIGNAL);

export const getStations = getByType.bind(null, SensorTypes.STATION);

export const getName = (pin: uint8_t): string => stations.find(({ id }) => id === pin)?.name || '';

export const getIcon = (pin: uint8_t): string => stations.find(({ id }) => id === pin)?.icon || '';
