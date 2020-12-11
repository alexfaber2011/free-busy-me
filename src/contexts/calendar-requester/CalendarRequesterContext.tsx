import * as React from 'react';
import { ICalendarRequester, NullCalendarRequester } from 'lib/calendars';
import UserContext from 'contexts/user';
import GoogleRequester from 'lib/calendars/google';

const CalendarRequesterContext = React.createContext<ICalendarRequester>(
  new NullCalendarRequester()
);

export const CalendarRequesterContextProvider: React.FC = ({ children }) => {
  const { calendarProviders } = React.useContext(UserContext);

  const requester = React.useMemo(() => {
    const noProvidersEnabled = calendarProviders.google.isEnabled() === false;
    const accessToken = calendarProviders.google.getAccessToken();
    if (noProvidersEnabled || !accessToken) return new NullCalendarRequester();

    return new GoogleRequester(accessToken);
  }, [calendarProviders]);

  return (
    <CalendarRequesterContext.Provider value={requester}>
      {children}
    </CalendarRequesterContext.Provider>
  );
};

export default CalendarRequesterContext;
