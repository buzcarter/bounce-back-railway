// local
import {
  getStations,
  SENSOR_VOLTS_THRESHOLD,
  STATION_CHBX,
  uint8_t,
} from '../../../common';
import { StationTransistions } from './StationManager';
import { analogRead } from './ControlManager';
// external
import { Serial } from '../../../microcontroller';
import { booleanRead } from '../../../simulator/components/Utils';

let currentStationId: uint8_t | null = null;

export const pollSensors = () => null;

// export const clearSensors = () => null;

// export const resetCurrentSensor = () => null;

export const getCurrentStationId = () => currentStationId;

export const getTransition = (): StationTransistions => {
  let transition = StationTransistions.NO_CHANGE;
  const station = getStations().find(({ id }) => analogRead(id) > SENSOR_VOLTS_THRESHOLD);
  if (station && station.id !== currentStationId) {
    transition = StationTransistions.ARRIVAL;
    currentStationId = station.id;
    if (booleanRead(STATION_CHBX)) {
      Serial.println({
        pin: station.id,
        action: 'arrived',
        name: station.name,
        layover: station.delay || 'none',
      });
    }
  } else if (!station && currentStationId !== null) {
    transition = StationTransistions.DEPARTURE;
    if (booleanRead(STATION_CHBX)) {
      Serial.println({
        pin: currentStationId,
        action: 'departed',
      });
    }
    currentStationId = null;
  }

  return transition;
};
