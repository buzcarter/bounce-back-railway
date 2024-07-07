import { DirectionTypes, SensorTypes } from '../constants';
import { CLOCK_SPEED } from '../microcontroller';
import { MAX_RIGHT_EDGE, MIN_LEFT_EDGE } from '../simulator/constants';

export const stations = [{
  id: 1,
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
  id: 2,
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
  id: 3,
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
  id: 4,
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
  id: 10,
  type: SensorTypes.SIGNAL,
  name: 'South Gate Crossing',
  position: 250,
  delay: 0,
}, {
  id: 11,
  type: SensorTypes.SIGNAL,
  name: '26 Ave (Higland Park)',
  position: 150,
  delay: 0,
}];
