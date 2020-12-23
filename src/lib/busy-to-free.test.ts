import {DateTime} from 'luxon';
import busyToFree from './busy-to-free';
import { Event } from './calendars';

/*
   *|===|===|===|===|===|
   *----2----
   *            ----4----
   */
const currentTime = DateTime.fromISO('2020-01-01', { zone: 'America/Chicago' });
const event2 = {
  start: currentTime,
  end: currentTime.plus({ hours: 2 })
};
const event4 = {
  start: currentTime.plus({ hours: 1.5 }),
  end: currentTime.plus({ hours: 2 })
};

it('returns the free time between begin and end (inclusive) if there are no busy events', () => {
  const busy: Event[] = [];
  const begin = DateTime.local();
  const end = DateTime.local().plus({ day: 1 });
  const free = busyToFree(busy, begin, end);
  expect(free).toHaveLength(1);
  expect(free[0].start.toMillis()).toEqual(begin.toMillis());
  expect(free[0].end.toMillis()).toEqual(end.toMillis());
});

it('returns the free time between begin and end (inclusive) if there are some busy events', () => {
  const busy = [event2, event4];
  const begin = currentTime.minus({ hours: 1 });
  const end = currentTime.plus({ day: 1 });
  const free = busyToFree(busy, begin, end);
  expect(free).toHaveLength(2);
  expect(free[0].start.toMillis()).toEqual(begin.toMillis());
  expect(free[0].end.toMillis()).toEqual(event2.start.toMillis());
  expect(free[1].start.toMillis()).toEqual(event4.end.toMillis());
  expect(free[1].end.toMillis()).toEqual(end.toMillis());
});

it('returns the correct free times if the begin time is after the first busy start', () => {
  const busy = [event2, event4];
  const begin = currentTime.plus({ hours: 1 });
  const end = currentTime.plus({ day: 1 });
  const free = busyToFree(busy, begin, end);
  expect(free).toHaveLength(1);
  expect(free[0].start.toMillis()).toEqual(event4.end.toMillis());
  expect(free[0].end.toMillis()).toEqual(end.toMillis());
});

it('returns the correct free times if the end time is after the last busy end', () => {
  const busy = [event2, event4];
  const begin = currentTime.minus({ hours: 1 });
  const end = event4.end.minus({ minutes: 1 });
  const free = busyToFree(busy, begin, end);
  expect(free).toHaveLength(1);
  expect(free[0].start.toMillis()).toEqual(begin.toMillis());
  expect(free[0].end.toMillis()).toEqual(event2.start.toMillis());
});
