import toHumanFriendly, {HumanFriendly} from './to-human-friendly';
import { Group } from './group-events';
import {DateTime} from 'luxon';
import { Event } from './calendars';

const start = DateTime.fromISO('2021-01-01').setZone('America/Chicago').startOf('day');

const fullDayEvent: Event = {
  start,
  end: start.plus({ day: 1 }),
};

const morningEvent: Event = {
  start: start.plus({ hours: 6 }),
  end: start.plus({ hours: 7 }),
};

const eveningEvent: Event = {
  start: start.plus({ hours: 18 }),
  end: start.plus({ hours: 19 }),
};

it('ouputs an empty array if given one', () => {
  expect(toHumanFriendly([])).toHaveLength(0);
});

it('ouputs an array if given a populated array of groups', () => {
  const group: Group = {
    type: 'day',
    start,
    events: [fullDayEvent],
  };

  const groups = [group, group];
  const result = toHumanFriendly(groups);
  expect(result.length).toBe(2);
});

it('outputs the correct syntax for one group with a full day event', () => {
  const group: Group = {
    type: 'day',
    start,
    events: [fullDayEvent],
  };

  const expectedResult: HumanFriendly = {
    label: 'Friday, Jan 1',
    description: 'from 12:00 AM CST to midnight',
  };

  const result = toHumanFriendly(group);
  expect(result.label).toEqual(expectedResult.label);
  expect(result.description).toEqual(expectedResult.description);
});

it('outputs the correct syntax for one group with no events', () => {
  const group: Group = {
    type: 'day',
    start,
    events: [],
  };

  const expectedResult: HumanFriendly = {
    label: 'Friday, Jan 1',
    description: 'open',
  };

  const result = toHumanFriendly(group);
  expect(result.label).toEqual(expectedResult.label);
  expect(result.description).toEqual(expectedResult.description);
});

it('outputs the correct syntax for one group with some events', () => {
  const group: Group = {
    type: 'day',
    start,
    events: [morningEvent, eveningEvent],
  };

  const expectedResult: HumanFriendly = {
    label: 'Friday, Jan 1',
    description: 'from 6:00 AM CST to 7:00 AM CST and from 6:00 PM CST to 7:00 PM CST',
  };

  const result = toHumanFriendly(group);
  expect(result.label).toEqual(expectedResult.label);
  expect(result.description).toEqual(expectedResult.description);
});
