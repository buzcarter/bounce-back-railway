import { int } from '../../common';

type Callback = (...args: unknown[]) => void;

class EventManager {
  private events: Map<number, Callback[]> = new Map();

  on(eventNumber: int, cb: Callback): void {
    const callbacks = this.events.get(eventNumber) || [];
    callbacks.push(cb);
    this.events.set(eventNumber, callbacks);
  }

  emit(eventNumber: int, ...args: unknown[]): void {
    const callbacks = this.events.get(eventNumber);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
  }
}

export const eventManager = new EventManager();
