import {FreeBusy} from './calendars';
import flatten, {combineEventsFromCalendars, sort} from './flatten-free-busy';
import { DateTime } from 'luxon';

const currentTime = DateTime.local();
const event1 = {
  start: currentTime,
  end: currentTime.plus({ hours: 1 })
};
const event2 = {
  start: currentTime,
  end: currentTime.plus({ hours: 2 })
};
const event3 = {
  start: currentTime.plus({ hours: 1 }),
  end: currentTime.plus({ hours: 2 })
};
const event4 = {
  start: currentTime.plus({ hours: 1.5 }),
  end: currentTime.plus({ hours: 2 })
};

describe('combineEventsFromCalendars', () => {
  it('returns an empty object when supplied an empty object', () => {
    expect(combineEventsFromCalendars({})).toHaveLength(0);
  });

  it('combines calendars into one array', () => {
    const freeBusy = {
      calendar1: [event2, event3],
      calendar2: [event4, event1],
    };
    const result = combineEventsFromCalendars(freeBusy);
    expect(result).toHaveLength(4);
  });
});

describe('sort', () => {
  it('returns an empty array if given one', () => {
    expect(sort([])).toHaveLength(0);
  });

  it('sorts from earliest to latest (by start time)', () => {
    const events = [event4, event2, event1, event3];
    const result = sort(events);
    expect(result[0].start.equals(event1.start)).toBe(true);
    expect(result[1].start.equals(event2.start)).toBe(true);
    expect(result[2].start.equals(event3.start)).toBe(true);
    expect(result[3].start.equals(event4.start)).toBe(true);
  });
});
describe('flatten', () => {
  it('flattens an empty freeBusy to an empty array', () => {
    expect(flatten({})).toHaveLength(0);
  });

  it('flattens freeBusy to a sorted, distinct freeBusyEvent array', () => {
  /*
   *|===|===|===|===|===|
   *--1--
   *      -2-
   *  -----3----
   *            ----4----
   */
    const current = DateTime.fromISO('2020-01-01');
    const event1 = { start: current, end: current.plus({hour: 1}) };
    const event2 = {
      start: current.plus({ hours: 1.5 }),
      end: current.plus({ hours: 2 })
    };
    const event3 = {
      start: current.plus({ hours: .5 }),
      end: current.plus({ hours: 2.75 })
    };
    const event4 = {
      start: current.plus({ hours: 4 }),
      end: current.plus({ hours: 6 })
    };
    const freeBusy: FreeBusy = {
      calendarId1: [ event3, event1 ],
      calendarId2: [ event2, event3, event4 ]
    };
    const flattened = flatten(freeBusy);
    /*
     *|===|===|===|===|===|
     *--1----3----
     *            ----4----
     */
    expect(flattened).toHaveLength(2);
    expect(flattened[0].start.toMillis()).toEqual(event1.start.toMillis());
    expect(flattened[0].end.toMillis()).toEqual(event3.end.toMillis());
    expect(flattened[1].start.toMillis()).toEqual(event4.start.toMillis());
    expect(flattened[1].end.toMillis()).toEqual(event4.end.toMillis());
  });
});
