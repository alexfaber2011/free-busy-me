import {DateTime} from 'luxon';
import { Group } from './group-events';
import { Event } from './calendars';
import rest from './rest';

const getDayLabel = (date: DateTime): string => {
  return date.toFormat('cccc, LLL d'); // Thursday, Jan 7
};

const getLabel = (group: Group): string => {
  // TODO - weave the start label for week in here
  return getDayLabel(group.start);
};

const formatTime = (date: DateTime): string => {
  return date.toFormat('t ZZZZ');
};

const getDescEnd = (start: DateTime, end: DateTime): string => {
  if (start.hasSame(end, 'day') == false) return 'midnight';

  return formatTime(end);
};

const getDescriptionFor = (
  { start, end }: Event,
  remaining: Event[],
  acc: string
): string => {
  const descStart = formatTime(start);
  const descEnd = getDescEnd(start, end);
  const descEvent = `${descStart} to ${descEnd}`;

  if (remaining.length === 0) return `${acc} ${descEvent}`;

  const newAcc = `${acc} ${descEvent} and from`;
  return getDescriptionFor(remaining[0], rest(remaining), newAcc);
};

const getDescription = ({ events }: Group): string => {
  if (events.length === 0) return 'open';

  return getDescriptionFor(events[0], rest(events), 'from');
};

export interface HumanFriendly {
  label: string;
  description:  string;
}

function toHumanFriendly(groupedEvent: Group): HumanFriendly;
function toHumanFriendly(groupedEvents: Group[]): HumanFriendly[];
function toHumanFriendly(args: unknown): unknown {
  if (Array.isArray(args)) {
    return (args as Group[]).map(group => toHumanFriendly(group));
  }

  const group = (args as Group);
  const label = getLabel(group);
  const description = getDescription(group);

  return { label, description };
}

export default toHumanFriendly;
