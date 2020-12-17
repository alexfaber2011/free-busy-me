import { FreeBusy, FreeBusyEvent } from './calendars';
import DecoratedEvent from './decorated-event';

export const combineEventsFromCalendars = (
  freeBusy: FreeBusy
): FreeBusyEvent[] => {
  return Object.values(freeBusy).flatMap(x => x);
};

export const sort = (events: FreeBusyEvent[]): FreeBusyEvent[] => {
  return events.sort((a, b) => (a.start.toMillis() - b.start.toMillis()));
};

const executeUniqueStep = (
  current: FreeBusyEvent | null = null,
  remainingEvents: FreeBusyEvent[],
  uniqueEvents: FreeBusyEvent[]
): FreeBusyEvent[] => {
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
const unique = (events: FreeBusyEvent[]): FreeBusyEvent[] => {
  return executeUniqueStep(events[0], events.slice(1), []);
};

export default (freeBusy: FreeBusy): FreeBusyEvent[] => {
  if (Object.keys(freeBusy).length === 0) return [];

  return unique(sort(combineEventsFromCalendars(freeBusy)));
};
