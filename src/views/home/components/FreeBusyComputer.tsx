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
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [isCalculating, setIsCalculating] = React.useState<boolean>(false);
  const [freeBusy, setFreeBusy] = React.useState<FreeBusy | null>({});
  const [error, setError] = React.useState<string | null>(null);

  const fetchFreeBusy = async () => {
    if (calendarIds.length === 0) return;

    setIsFetching(true);
    const options: FreeBusyOptions = {
      calendarIds,
      startDate: start,
      endDate: end,
    };

    try {
      const fb = await requester.getFreeBusy(options);
      setFreeBusy(fb);
      setError(null);
    } catch (e) {
      console.error(e);
      setFreeBusy(null);
      setError(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    fetchFreeBusy();
  }, [requester, calendarIds, start, end]);

  const computed: Group[] = React.useMemo(() => {
    if (error || freeBusy === null) return [];
    if (Object.keys(freeBusy).length === 0) return [];

    setIsCalculating(true);
    const flattened = flatten(freeBusy);
    const free = busyToFree(flattened, start, end);
    const grouped = groupEvents(free, { by: 'day', timeZone });
    setIsCalculating(false);
    return grouped;
  }, [freeBusy, error, start, end]);

  return <>{children({
    result: computed,
    error,
    isComputing: isFetching || isCalculating,
  })}</>;
};

export default FreeBusyComputer;
