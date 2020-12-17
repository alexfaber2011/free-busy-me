import * as React from 'react';
import { ICalendarRequester, NullCalendarRequester } from 'lib/calendars';
import UserContext from 'contexts/user';
import GoogleRequester from 'lib/calendars/google';
import AuthContext from 'contexts/auth';

const CalendarRequesterContext = React.createContext<ICalendarRequester>(
  new NullCalendarRequester()
);

export const CalendarRequesterContextProvider: React.FC = ({ children }) => {
  const { calendarProviders } = React.useContext(UserContext);
  const { signInWithGoogle } = React.useContext(AuthContext);

  const requester = React.useMemo(() => {
    const noProvidersEnabled = calendarProviders.google.isEnabled() === false;
    const accessToken = calendarProviders.google.getAccessToken();
    if (noProvidersEnabled || !accessToken) return new NullCalendarRequester();

    return new GoogleRequester(accessToken);
  }, [calendarProviders]);

  const reauthenticateIfNeeded = async () => {
    if (calendarProviders.google.isEnabled() === false) return;
    if (await requester.needsToAuthenticate() === false) return;

    signInWithGoogle();
  };

  // TODO - call reauthenticateIfNeeded every few mins to keep things fresh
  React.useEffect(() => { reauthenticateIfNeeded() }, [requester]);

  return (
    <CalendarRequesterContext.Provider value={requester}>
      {children}
    </CalendarRequesterContext.Provider>
  );
};

export default CalendarRequesterContext;
