import { EventTypes } from "../interfaces/EventTypes";

let currentEvent: EventTypes = EventTypes.OK;

export const set = (eventType: EventTypes): void => {
  currentEvent = eventType;
}

export const get = (): EventTypes => {
  return currentEvent;
}
