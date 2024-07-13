import { DirectionTypes } from '../constants/DirectionTypes';
import { CLOCK_SPEED } from '../constants/MicrocontrollerConstants';
import {
  SENSOR_26TH_AVE_XING, SENSOR_ATWATER_XING, SENSOR_LT_LA, SENSOR_MIDDLE_BURBANK, SENSOR_RT_CLAREMONT, SENSOR_SOUTH_GATE_XING,
} from '../constants/PinAssignments';
import { SensorTypes } from '../constants/SensorTypes';
import { MAX_RIGHT_EDGE, MIN_LEFT_EDGE } from '../constants/SimulatorConstants';

export const stations = [{
  id: SENSOR_LT_LA,
  type: SensorTypes.STATION,
  name: 'LA Central Station',
  position: MIN_LEFT_EDGE, // px from left
  reverseDirection: true,
  delay: 2000 / CLOCK_SPEED, // ms
  icon: 'station-1',
  defaultDirection: DirectionTypes.RIGHT,
  style: {
    top: '68px', left: '16px',
  },
}, {
  id: SENSOR_RT_CLAREMONT,
  type: SensorTypes.STATION,
  name: 'Claremont Station',
  position: MAX_RIGHT_EDGE, // px from left
  reverseDirection: true,
  delay: 3000 / CLOCK_SPEED, // ms
  icon: 'station-2',
  defaultDirection: DirectionTypes.LEFT,
  style: {
    top: '68px', right: '16px',
  },
}, {
  id: SENSOR_MIDDLE_BURBANK,
  type: SensorTypes.STATION,
  name: 'Burbank Platform',
  position: 400, // px from left
  reverseDirection: false,
  delay: 1500 / CLOCK_SPEED, // ms
  icon: 'passenger-platform',
  style: {
    top: '64px', right: '50%',
  },
}, {
  id: SENSOR_ATWATER_XING,
  type: SensorTypes.STATION,
  name: 'Atwater Crossing',
  position: 700, // px from left
  reverseDirection: false,
  delay: 750 / CLOCK_SPEED, // ms
  icon: 'crossing-signal',
  style: {
    top: '73px',
    right: '172px',
    height: '22px',
  },
}, {
  id: SENSOR_SOUTH_GATE_XING,
  type: SensorTypes.SIGNAL,
  name: 'South Gate Crossing',
  position: 250,
  delay: 0,
  icon: 'location',
}, {
  id: SENSOR_26TH_AVE_XING,
  type: SensorTypes.SIGNAL,
  name: '26 Ave (Higland Park)',
  position: 150,
  delay: 0,
  icon: 'location',
}];
