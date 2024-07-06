/* eslint-disable key-spacing, no-multi-spaces */
export enum EventTypes {
  OK =                     'ok',

  BEGIN_SLOW_STOP =        'slow:stopping',
  BEGIN_SLOW_START =       'slow:starting',
  CONTINUE_SPEED_CHANGE =  'slow:continuing',

  HOLDING =                'holding',

  STATION_ARRIVAL =        'station:arrival',
  STATION_DEPARTURE =      'station:departure',
}
/* eslint-enable key-spacing, no-multi-spaces */

let currentEvent: EventTypes = EventTypes.OK;

// eslint-disable-next-line no-return-assign
export const set = (eventType: EventTypes): EventTypes => currentEvent = eventType;

export const get = (): EventTypes => currentEvent;
