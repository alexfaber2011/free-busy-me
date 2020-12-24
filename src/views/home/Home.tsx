import CalendarRequesterContext from 'contexts/calendar-requester';
import UserContext from 'contexts/user';
import {Calendar, FreeBusy} from 'lib/calendars';
import * as React from 'react';
import FreeBusyComputer from './components/FreeBusyComputer';
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

  return (
    <>
      <FreeBusyComputer
        requester={requester}
        calendarIds={googleProvider.getEnabledCalendarIdsArray()}>
        {({ result, error, isComputing }) => (
          <Output group={result} error={error} renderLoading={isComputing} />
        )}
      </FreeBusyComputer>
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
