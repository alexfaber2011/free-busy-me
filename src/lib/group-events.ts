import { Event } from './calendars';
import { DateTime, Duration } from 'luxon';
import DecoratedEvent from './decorated-event';

const convertToTimeZone = (events: Event[], timeZone: string): Event[] => {
  return events.map(ev => ({
    start: ev.start.setZone(timeZone),
    end: ev.end.setZone(timeZone),
  }));
};

type GroupBy = 'day' | 'week';

const getNumberOfTimeUnits = (events: Event[], timeUnit: GroupBy): number => {
  const extremeStart = events[0].start.startOf(timeUnit);
  const extremeEnd = events[events.length - 1].end.endOf(timeUnit);
  const diff = extremeEnd.diff(extremeStart, timeUnit);
  return timeUnit === 'week' ? diff.weeks : diff.days;
};

const rangeOf = (
  num: number,
  start: DateTime,
  timeUnit: GroupBy
): DateTime[] => {
  const durationOption = timeUnit === 'week' ? { weeks: 1 } : { days: 1 };
  const duration = Duration.fromObject(durationOption);
  const acc = [];
  let currentStart = start.startOf(timeUnit);
  for (let i = 0; i < num; i++) {
    acc.push(currentStart);
    currentStart = currentStart.plus(duration);
  }
  return acc;
};

/**
 * Precondition, assumes events are sorted
 */
const rangeFrom = (events: Event[], timeUnit: GroupBy): DateTime[] => {
  if (events.length === 0) return [];

  const numOfTimeUnits = getNumberOfTimeUnits(events, timeUnit);
  const rangeStart = events[0].start;
  return rangeOf(numOfTimeUnits, rangeStart, timeUnit);
};

/**
 * Given an array of events, and a datetime.  This will function will
 * return an array of events that are part of that datetime's day or week
 * (whichever is specified).  If an event extends before or after the datetime's
 * start or end of the day/week, it will be clipped.
 *
 * precondition: assumes dateTime is at the start of the time unit (either day
 * or week)
 */
const pluckEvents = (
  events: Event[],
  dateTime: DateTime,
  timeUnit: GroupBy
): Event[] => {
  return events.reduce((acc, ev) => {
    const event = new DecoratedEvent(ev);
    const timeInterval = new DecoratedEvent({
      start: dateTime,
      end: dateTime.plus(timeUnit === 'week' ? { week: 1 } : { day: 1 })
    });

    if (timeInterval.overlaps(event) === false) return acc;
    if (timeInterval.startsBefore(event) && timeInterval.endsAfter(event)) {
      return [...acc, ev];
    }
    if (event.startsBefore(timeInterval) && event.endsAfter(timeInterval)) {
      return [...acc, { start: timeInterval.start, end: timeInterval.end }];
    }
    if (event.endsAfter(timeInterval)) {
      return [...acc, { start: event.start, end: timeInterval.end }];
    }

    return [...acc, { start: timeInterval.start, end: event.end }];
  }, [] as Event[]);
};

export interface Group {
  type: GroupBy;
  start: DateTime;
  events: Event[]
}

interface Options {
  by: GroupBy;
  timeZone: string;
}

/*
 * Precondition: assumes events are sorted and unique (non-overlapping)
 */
const groupEvents = (events: Event[], options: Options): Group[] => {
  if (events.length === 0) return [];

  const timeUnit = options.by;
  const convertedEvents = convertToTimeZone(events, options.timeZone);
  const range = rangeFrom(convertedEvents, timeUnit);

  return range.map(startDateTime => ({
    type: options.by,
    start: startDateTime,
    events: pluckEvents(convertedEvents, startDateTime, timeUnit),
  }));
};

export default groupEvents;
