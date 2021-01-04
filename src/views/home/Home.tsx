import CalendarRequesterContext from 'contexts/calendar-requester';
import UserContext from 'contexts/user';
import {Calendar} from 'lib/calendars';
import {DateTime} from 'luxon';
import * as React from 'react';
import FreeBusyComputer from './components/FreeBusyComputer';
import Input from './components/Input';
import Output from './components/Output';
import TimeBoundary from './components/TimeBoundary';

const Home: React.FC = () => {
  const {
    calendarProviders,
    updateGoogleCalendarProvider
  } = React.useContext(UserContext);
  const requester = React.useContext(CalendarRequesterContext);
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [boundaryStart, setBoundaryStart] = React.useState<DateTime>(
    DateTime.local()
  );
  const [boundaryEnd, setBoundaryEnd] = React.useState<DateTime>(
    DateTime.local().plus({ weeks: 2 })
  );

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
      <h1>freebusy.me</h1>
      <p>
        <em>busy me, free</em>
      </p>
      <FreeBusyComputer
        start={boundaryStart}
        end={boundaryEnd}
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
      <TimeBoundary
        start={boundaryStart}
        end={boundaryEnd}
        onStartChanged={setBoundaryStart}
        onEndChanged={setBoundaryEnd}
      />
      <button onClick={fetchCalendarList}>Get</button>
    </>
  );
};

export default Home;
