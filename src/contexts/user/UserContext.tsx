import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';
import GoogleRequester from 'lib/calendars/google';
import {
  CalendarProviderData
} from 'lib/firebase/users/calendar-providers/calendar-providers';

interface UserGoogleCalendarProvider extends CalendarProviderData {
  enabled: boolean;
}

interface IUserContext {
  user: User;
  calendarProviders: {
    google: UserGoogleCalendarProvider;
  };
}

const defaultGoogleCalendarProvider: UserGoogleCalendarProvider = {
  enabled: false,
  accessToken: null,
  enabledCalendarsById: {}
};

const defaultContext: IUserContext = {
  user: new User(),
  calendarProviders: {
    google: defaultGoogleCalendarProvider,
  }
};

const UserContext = React.createContext<IUserContext>(defaultContext);

interface UserContextProviderProps {
  user: User;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  user,
  children
}) => {
  const [googleCalendarProvider, setGoogleCalendarProvider] = React.useState<
    UserGoogleCalendarProvider
  >(defaultGoogleCalendarProvider);

  const storeGoogleCalendarProvider = (provider: CalendarProviderData) => {
    setGoogleCalendarProvider({
      enabled: true,
      ...provider
    });
  };

  const clearGoogleCalendarProvider =
    () => setGoogleCalendarProvider(defaultGoogleCalendarProvider);

  React.useEffect(() => {
    if (user.isSignedIn === false) return;

    return firebase.users.user(user.id).calendarProviders.google.listen(
      storeGoogleCalendarProvider,
      clearGoogleCalendarProvider
    );
  }, [user]);

  const fetchCalendarList = async (accessToken: string) => {
    const requester = new GoogleRequester(accessToken);
    try {
      const response = await requester.getCalendarList();
      console.log('response: ', response);
    } catch (e) {
      console.error(e);
    }
  };

  // TODO - Next step: figure out where you want to display the calendar
  // selector
  React.useEffect(() => {
    if (googleCalendarProvider.enabled && googleCalendarProvider.accessToken) {
      fetchCalendarList(googleCalendarProvider.accessToken);
    }
  }, [googleCalendarProvider]);

  const value = { user, calendarProviders: { google: googleCalendarProvider } };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );


};

export default UserContext;
