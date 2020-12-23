import { DateTime } from 'luxon';
import groupEvents from './group-events';

const currentTime = DateTime.fromISO('2020-01-01', { zone: 'America/Chicago' });
const wednesdayEvent1 = {
  start: currentTime.plus({ hours: 6 }),
  end: currentTime.plus({ hours: 8 })
};
// The following date spills into Thursday when in Central and Eastern time
const wednesdayEvent2 = {
  start: currentTime.plus({ hours: 23 }),
  end: currentTime.plus({ hours: 25 }),
};
const fridayEvent = {
  start: currentTime.plus({ days: 2, hours: 6 }),
  end: currentTime.plus({ days: 2, hours: 8 })
};

it('groups by day in eastern time', () => {
  const events = [wednesdayEvent1, wednesdayEvent2, fridayEvent];
  const result = groupEvents(events, { by: 'day', timeZone: 'America/New_York' });
  expect(result.length).toEqual(3);
  const wednesdayGroup = result[0];
  const thursdayGroup = result[1];
  const fridayGroup = result[2];
  expect(wednesdayGroup.start.hasSame(wednesdayEvent1.start, 'day')).toBe(true);
  expect(wednesdayGroup.events.length).toEqual(1);
  expect(thursdayGroup.start.hasSame(wednesdayEvent2.start, 'day')).toBe(true);  // This is actually Thursday
  expect(thursdayGroup.events.length).toEqual(1);
  expect(fridayGroup.start.hasSame(fridayEvent.start, 'day')).toBe(true);
  expect(fridayGroup.events.length).toEqual(1);
});

it('groups by day in central time', () => {
  const events = [wednesdayEvent1, wednesdayEvent2, fridayEvent];
  const result = groupEvents(events, { by: 'day', timeZone: 'America/Chicago'});
  expect(result.length).toEqual(3);
  const wednesdayGroup = result[0];
  const thursdayGroup = result[1];
  const fridayGroup = result[2];
  expect(wednesdayGroup.start.hasSame(wednesdayEvent1.start, 'day')).toBe(true);
  expect(wednesdayGroup.events.length).toEqual(2);
  expect(thursdayGroup.start.hour).toBe(0);
  expect(thursdayGroup.events.length).toEqual(1);
  expect(fridayGroup.start.hasSame(fridayEvent.start, 'day')).toBe(true);
  expect(fridayGroup.events.length).toEqual(1);
});

it('groups by day in mountain time', () => {
  const events = [wednesdayEvent1, wednesdayEvent2, fridayEvent];
  const result = groupEvents(events, { by: 'day', timeZone: 'America/Denver' });
  expect(result.length).toEqual(3);
  const wednesdayGroup = result[0];
  const thursdayGroup = result[1];
  const fridayGroup = result[2];
  expect(wednesdayGroup.start.hasSame(wednesdayEvent1.start, 'day')).toBe(true);
  expect(wednesdayGroup.events.length).toEqual(2);
  expect(thursdayGroup.events.length).toEqual(0);
  expect(fridayGroup.start.hasSame(fridayEvent.start, 'day')).toBe(true);
  expect(fridayGroup.events.length).toEqual(1);
});

it('groups by day in pacific time', () => {
  const events = [wednesdayEvent1, wednesdayEvent2, fridayEvent];
  const result = groupEvents(events, { by: 'day', timeZone: 'America/Los_Angeles' });
  expect(result.length).toEqual(3);
  const wednesdayGroup = result[0];
  const thursdayGroup = result[1];
  const fridayGroup = result[2];
  expect(wednesdayGroup.start.hasSame(wednesdayEvent1.start, 'day')).toBe(true);
  expect(wednesdayGroup.events.length).toEqual(2);
  expect(thursdayGroup.events.length).toEqual(0);
  expect(fridayGroup.start.hasSame(fridayEvent.start, 'day')).toBe(true);
  expect(fridayGroup.events.length).toEqual(1);
});

it('handles very long events that span multiple days', () => {
  const wednesdayToFriday = {
    start: wednesdayEvent1.start,
    end: wednesdayEvent1.end.plus({ days: 2 }),
  };

  const events = [wednesdayToFriday];
  const results = groupEvents(events, { by: 'day', timeZone: 'America/Chicago' });
  expect(results.length).toEqual(3);
  expect(results[0].start.hasSame(wednesdayToFriday.start, 'day')).toBe(true);
  expect(results[1].start.hasSame(wednesdayToFriday.start.plus({ day: 1 }), 'day')).toBe(true);
  expect(results[2].start.hasSame(wednesdayToFriday.end, 'day')).toBe(true);
});

it('handles events that are the exact same length as the time interval', () => {
  const fullDayEvent = {
    start: currentTime.startOf('day'),
    end: currentTime.endOf('day'),
  };
  const events = [fullDayEvent];
  const results = groupEvents(events, { by: 'day', timeZone: 'America/Chicago' });
  expect(results.length).toEqual(1);
  expect(results[0].start.hasSame(fullDayEvent.start, 'day')).toBe(true);
});

it('handles events that are the exact same length as the time interval (when the time interval is weeks)', () => {
  const start = currentTime.startOf('day');
  const fullDayEvent = { start, end: start.plus({ week: 1 }) };
  const events = [fullDayEvent];
  const results = groupEvents(events, { by: 'week', timeZone: 'America/Chicago' });
  /**
   * The start of the week is computed by the first monday befor the start of
   * the first event.
   *
   * The end of the week is the next sunday after the last event's end date
   */
  expect(results.length).toEqual(2);
});
