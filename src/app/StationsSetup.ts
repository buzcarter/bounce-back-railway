import { DirectionTypes } from "./interfaces/DirectionTypes";

export const stations = [{
  id: 1,
  name: 'LA Central Station',
  position: 0, // px from left
  reverseDirection: true,
  delay: 2000, // ms
  icon: 'station-1',
  defaultDirection: DirectionTypes.RIGHT,
  style: {
    top: '68px', left: '16px',
  },
}, {
  id: 2,
  name: 'Claremont Station',
  position: 800, // px from left
  reverseDirection: true,
  delay: 3000, // ms
  icon: 'station-2',
  defaultDirection: DirectionTypes.LEFT,
  style: {
    top: '68px', right: '16px',
  },
}, {
  id: 3,
  name: 'Burbank Platform',
  position: 400, // px from left
  reverseDirection: false,
  delay: 1500, // ms
  icon: 'passenger-platform',
  style: {
    top: '64px', right: '50%',
  },
}, {
  id: 4,
  name: 'Atwater Crossing',
  position: 700, // px from left
  reverseDirection: false,
  delay: 750, // ms
  icon: 'crossing-signal',
  style: {
    top: '73px',
    right: '165px',
    height: '22px',
  },
}];
