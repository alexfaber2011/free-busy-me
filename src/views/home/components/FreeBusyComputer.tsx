import * as React from 'react';
import { FreeBusy, FreeBusyOptions, ICalendarRequester } from 'lib/calendars';
import groupEvents, {Group} from 'lib/group-events';
import flatten from 'lib/flatten-free-busy';
import busyToFree from 'lib/busy-to-free';
import { DateTime } from 'luxon';

interface Output {
  result: Group[];
  error: string | null;
  isComputing: boolean;
}

interface FreeBusyComputerProps {
  calendarIds: string[];
  children(output: Output): React.ReactNode;
  end: DateTime;
  requester: ICalendarRequester;
  start: DateTime;
  timeZone?: string;
}

const FreeBusyComputer: React.FC<FreeBusyComputerProps> = ({
  calendarIds,
  children,
  end,
  requester,
  start,
  timeZone = 'America/Chicago',
}) => {
  const [isComputing, setIsComputing] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<Group[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFreeBusy = async (): Promise<FreeBusy> => {
    if (calendarIds.length === 0) return {};

    setIsComputing(true);
    const options: FreeBusyOptions = {
      calendarIds,
      startDate: start,
      endDate: end,
    };

    try {
      const fb = await requester.getFreeBusy(options);
      setError(null);
      return fb;
    } catch (e) {
      console.error(e);
      setError(e.message);
      setIsComputing(false);
      return {};
    }
  };

  const compute = (freeBusy: FreeBusy | null = null): Group[] => {
    if (freeBusy === null) return [];
    if (Object.keys(freeBusy).length === 0) return [];

    const flattened = flatten(freeBusy);
    const free = busyToFree(flattened, start, end);
    const grouped = groupEvents(free, { by: 'day', timeZone });
    setIsComputing(false);
    return grouped;
  };

  const work = async () => {
    const fb = await fetchFreeBusy();
    const computed = compute(fb);
    setResult(computed);
  };

  React.useEffect(() => {
    work();
  }, [requester, calendarIds, start, end, timeZone]);

  return <>{children({ result, error, isComputing })}</>;
};

export default FreeBusyComputer;
