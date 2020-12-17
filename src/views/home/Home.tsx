import CalendarRequesterContext from 'contexts/calendar-requester';
import UserContext from 'contexts/user';
import {Calendar, FreeBusy} from 'lib/calendars';
import * as React from 'react';
import Input from './components/Input';
import Output from './components/Output';

const Home: React.FC = () => {
  const {
    calendarProviders,
    updateGoogleCalendarProvider
  } = React.useContext(UserContext);
  const requester = React.useContext(CalendarRequesterContext);
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [freeBusy, setFreeBusy] = React.useState<FreeBusy | null>(null);

  const googleProvider = calendarProviders.google;

  const fetchCalendarList = async () => {
    setIsLoading(true);
    try {
      const calendars = await requester.getCalendarList();
      setCalendars(calendars);
    } catch (e) {
      console.error(e);
      setCalendars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calendarProviderName = googleProvider.isEnabled()
    ? 'Google'
    : null;

  const reducedCalendars = calendars.map(calendar => ({
    color: calendar.color,
    enabled: googleProvider.calendarIsEnabled(calendar.id),
    id: calendar.id,
    name: calendar.name,
  }));

  const handleCalendarToggle = async (calendarId: string) => {
    googleProvider.toggleCalendar(calendarId);
    try {
      await updateGoogleCalendarProvider(googleProvider);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchFreeBusy = async () => {
    const options = {
      calendarIds: googleProvider.getEnabledCalendarIdsArray(),
    };
    try {
      const fb = await requester.getFreeBusy(options);
      setFreeBusy(fb);
    } catch {
      setFreeBusy(null);
    }
  };

  React.useEffect(() => {
    if (googleProvider.isEnabled() === false) return;

    fetchFreeBusy();
  }, [googleProvider]);

  return (
    <>
      <Output freeBusy={freeBusy} />
      <Input
        calendarProviderName={calendarProviderName}
        isLoading={isLoading}
        calendars={reducedCalendars}
        onCalendarToggle={handleCalendarToggle}
      />
      <button onClick={fetchCalendarList}>Get</button>
    </>
  );
};

export default Home;
