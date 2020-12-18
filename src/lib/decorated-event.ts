import {DateTime} from 'luxon';
import { Event } from './calendars';

export default class DecoratedEvent {
  public start: DateTime;
  public end: DateTime;

  constructor({ start, end }: Event) {
    this.start = start;
    this.end = end;
  }

  endsAfter(date: DateTime): boolean;
  endsAfter(otherEvent: DecoratedEvent): boolean;
  endsAfter(arg: unknown): boolean {
    if (arg instanceof DateTime) return this.end >= arg;

    const otherEvent = arg as DecoratedEvent;
    return this.end >= otherEvent.end;
  }

  overlaps(date: DateTime): boolean;
  overlaps(otherEvent: DecoratedEvent): boolean;
  overlaps(arg: unknown): boolean {
    if (arg instanceof DateTime) {
      const date = arg;
      return this.startsBefore(date) && this.endsAfter(date);
    }

    const otherEvent = arg as DecoratedEvent;
    const [earlier, later] = DecoratedEvent.sort(this, otherEvent);
    return earlier.end > later.start;
  }

  startsBefore(date: DateTime): boolean;
  startsBefore(otherEvent: DecoratedEvent): boolean;
  startsBefore(arg: unknown): boolean {
    if (arg instanceof DateTime) return this.start <= arg;

    const otherEvent = arg as DecoratedEvent;
    return this.start <= otherEvent.start;
  }

  toString(): string {
    return `${this.start.toISO()} - ${this.end.toISO()}`;
  }

  static sort(
    a: DecoratedEvent,
    b: DecoratedEvent
  ): [DecoratedEvent, DecoratedEvent] {
    return (a.start <= b.start) ? [a, b] : [b, a];
  }
}

