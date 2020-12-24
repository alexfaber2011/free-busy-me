import * as React from 'react';
import { FreeBusy, ICalendarRequester } from 'lib/calendars';
import groupEvents, {Group} from 'lib/group-events';
import flatten from 'lib/flatten-free-busy';
import busyToFree from 'lib/busy-to-free';

interface Output {
  result: Group[];
  error: string | null;
  isComputing: boolean;
}

interface FreeBusyComputerProps {
  requester: ICalendarRequester;
  calendarIds: string[];
  timeZone?: string;
  children(output: Output): React.ReactNode;
}

const FreeBusyComputer: React.FC<FreeBusyComputerProps> = ({
  calendarIds,
  children,
  requester,
  timeZone = 'America/Chicago',
}) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [isCalculating, setIsCalculating] = React.useState<boolean>(false);
  const [freeBusy, setFreeBusy] = React.useState<FreeBusy | null>({});
  const [error, setError] = React.useState<string | null>(null);

  const fetchFreeBusy = async () => {
    if (calendarIds.length === 0) return;

    setIsFetching(true);
    const options = { calendarIds };
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
  }, [requester, calendarIds]);

  const computed: Group[] = React.useMemo(() => {
    if (error || freeBusy === null) return [];
    if (Object.keys(freeBusy).length === 0) return [];

    setIsCalculating(true);
    const flattened = flatten(freeBusy);
    const free = busyToFree(flattened);
    const grouped = groupEvents(free, { by: 'day', timeZone });
    setIsCalculating(false);
    return grouped;
  }, [freeBusy, error]);

  return <>{children({
    result: computed,
    error,
    isComputing: isFetching || isCalculating,
  })}</>;
};

export default FreeBusyComputer;
