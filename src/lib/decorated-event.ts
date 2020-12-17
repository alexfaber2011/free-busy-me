import {DateTime} from 'luxon';
import { FreeBusyEvent } from './calendars';

export default class DecoratedEvent {
  public start: DateTime;
  public end: DateTime;

  constructor({ start, end }: FreeBusyEvent) {
    this.start = start;
    this.end = end;
  }

  overlaps(otherEvent: DecoratedEvent): boolean {
    const [earlier, later] = DecoratedEvent.sort(this, otherEvent);
    return earlier.end > later.start;
  }

  endsAfter(otherEvent: DecoratedEvent): boolean {
    return this.end > otherEvent.end;
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

