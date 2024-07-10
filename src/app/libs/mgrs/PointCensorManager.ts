import { SENSOR_VOLTS_THRESHOLD, STATION_CHBX } from '../../constants';
import { uint8_t } from '../../interfaces';
import { Serial } from '../../microcontroller';
import { getStations } from '../../simulator/components/StationsHelper';
import { analogRead, booleanRead } from './ControlManager';
import { StationTransistions } from './StationManager';

let currentStationId: uint8_t | null = null;

export const pollSensors = () => null;

// export const clearSensors = () => null;

// export const resetCurrentSensor = () => null;

export const getCurrentStation = () => getStations().find((station: { id: uint8_t}) => station.id === currentStationId);

export const getCurrentStationId = () => currentStationId;

export const getTransition = (): StationTransistions => {
  let transition = StationTransistions.NO_CHANGE;
  const station = getStations().find(({ id }) => analogRead(id) > SENSOR_VOLTS_THRESHOLD);
  if (station && station.id !== currentStationId) {
    transition = StationTransistions.ARRIVAL;
    currentStationId = station.id;
    if (booleanRead(STATION_CHBX)) {
      Serial.println({
        Arrived: `${station.name} (${station.id})`,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    transition = StationTransistions.DEPARTURE;
    if (booleanRead(STATION_CHBX)) {
      Serial.println({
        Departed: currentStationId,
      });
    }
    currentStationId = null;
  }

  return transition;
};
