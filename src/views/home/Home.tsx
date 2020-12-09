import CalendarRequesterContext from 'contexts/calendar-requester';
import UserContext from 'contexts/user';
import {Calendar} from 'lib/calendars';
import * as React from 'react';
import Input from './components/Input';
import Output from './components/Output';

const Home: React.FC = () => {
  const { calendarProviders } = React.useContext(UserContext);
  const requester = React.useContext(CalendarRequesterContext);
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

  const calendarProviderName = calendarProviders.google.enabled
    ? 'Google'
    : null;

  const reducedCalendars = calendars.map(calendar => ({
    color: calendar.color,
    enabled: true,
    id: calendar.id,
    name: calendar.name,
  }));

  const handleCalendarToggle = (calendarId: string, enabled: boolean) => {
    console.log('calendarId: ', calendarId);
    console.log('enabled: ', enabled);
  };

  return (
    <>
      <Output />
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
