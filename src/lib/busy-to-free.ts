import { DateTime } from 'luxon';
import { Event } from './calendars';
import DecoratedEvent from './decorated-event';
import { sort, unique } from './flatten-free-busy';

const establishEnd = (
  currentEvent: Event, // This shouldn't have a proper end date yet
  remainingBusyEvents: Event[],
  freeEvents: Event[],
  boundaryEnd: DateTime,
): Event[] => {
  if (remainingBusyEvents.length === 0) {
    currentEvent.end = boundaryEnd;
    return [...freeEvents, currentEvent];
  }

  const currentBusyEvent = new DecoratedEvent(remainingBusyEvents[0]);

  if (currentBusyEvent.overlaps(boundaryEnd)) {
    currentEvent.end = currentBusyEvent.start;
    return [...freeEvents, currentEvent];
  }

  currentEvent.end = currentBusyEvent.start;

  const nextEvent = { start: currentBusyEvent.end, end: DateTime.local() };
  const r = remainingBusyEvents.splice(1);
  const f = [...freeEvents, currentEvent];

  return establishEnd(nextEvent, r, f, boundaryEnd);
};

const busyToFree = (
  busy: Event[],
  boundaryStart: DateTime = DateTime.local(),
  boundaryEnd: DateTime = DateTime.local().plus({ weeks: 2 })
): Event[] => {
  if (busy.length === 0) return [{ start: boundaryStart, end: boundaryEnd }];

  const b = unique(sort(busy));
  const firstBusyEvent = new DecoratedEvent(b[0]);

  if (firstBusyEvent.overlaps(boundaryStart)) {
    const currentFree = { start: firstBusyEvent.end, end: DateTime.local() };
    const remainingEvents = b.splice(1);
    const freeEvents: Event[] = [];
    return establishEnd(currentFree, remainingEvents, freeEvents, boundaryEnd);
  }

  const currentFree = { start: boundaryStart, end: DateTime.local() };
  const remainingEvents = b;
  const freeEvents: Event[] = [];
  return establishEnd(currentFree, remainingEvents, freeEvents, boundaryEnd);
};

export default busyToFree;
