import { FreeBusy, Event } from './calendars';
import DecoratedEvent from './decorated-event';

export const combineEventsFromCalendars = (
  freeBusy: FreeBusy
): Event[] => {
  return Object.values(freeBusy).flatMap(x => x);
};

export const sort = (events: Event[]): Event[] => {
  return events.sort((a, b) => (a.start.toMillis() - b.start.toMillis()));
};

const executeUniqueStep = (
  current: Event | null = null,
  remainingEvents: Event[],
  uniqueEvents: Event[]
): Event[] => {
  if (current === null) return uniqueEvents;

  const currentEvent = new DecoratedEvent(current);
  const nextEvent =
    remainingEvents[0] && new DecoratedEvent(remainingEvents[0]);

  if (!nextEvent || currentEvent.overlaps(nextEvent) === false) {
    const next = remainingEvents[0];
    const r = remainingEvents.slice(1);
    const u = [...uniqueEvents, current];
    return executeUniqueStep(next, r, u);
  }

  // We've got overlapping events
  const end = currentEvent.endsAfter(nextEvent)
    ? currentEvent.end
    : nextEvent.end;
  const next = { start: currentEvent.start, end };
  const r = remainingEvents.slice(1);
  const u = uniqueEvents;
  return executeUniqueStep(next, r, u);
};

/**
 * precondition: events must be sorted by start
 */
export const unique = (events: Event[]): Event[] => {
  return executeUniqueStep(events[0], events.slice(1), []);
};

export default (freeBusy: FreeBusy): Event[] => {
  if (Object.keys(freeBusy).length === 0) return [];

  return unique(sort(combineEventsFromCalendars(freeBusy)));
};
