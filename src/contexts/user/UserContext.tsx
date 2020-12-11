import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';
import DecoratedGoogleCalendarProviderData from 'lib/firebase/users/calendar-providers/decorated-google-calendar-provider-data';

interface IUserContext {
  user: User;
  calendarProviders: {
    google: DecoratedGoogleCalendarProviderData;
  };
  updateGoogleCalendarProvider(
    googleProvider: DecoratedGoogleCalendarProviderData
  ): Promise<void>;
}

const defaultContext: IUserContext = {
  user: new User(),
  calendarProviders: {
    google: new DecoratedGoogleCalendarProviderData(),
  },
  updateGoogleCalendarProvider: () => Promise.resolve(),
};

const UserContext = React.createContext<IUserContext>(defaultContext);

interface UserContextProviderProps {
  user: User;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  user,
  children
}) => {
  const [decoratedGoogleProvider, setDecoratedGoogleProvider] = React.useState<
    DecoratedGoogleCalendarProviderData
  >(new DecoratedGoogleCalendarProviderData());

  const clearGoogleCalendarProviderData =
    () => setDecoratedGoogleProvider(new DecoratedGoogleCalendarProviderData());

  React.useEffect(() => {
    if (user.isSignedIn === false) return clearGoogleCalendarProviderData();

    return firebase.users.user(user.id).calendarProviders.google.listen(
      setDecoratedGoogleProvider,
      () => setDecoratedGoogleProvider(new DecoratedGoogleCalendarProviderData)
    );
  }, [user]);

  const updateGoogleCalendarProvider = (
    googleProvider: DecoratedGoogleCalendarProviderData
  ): Promise<void> => {
    return firebase
      .users
      .user(user.id)
      .calendarProviders
      .google
      .set(googleProvider);
  };

  const value = {
    user,
    calendarProviders: {
      google: decoratedGoogleProvider
    },
    updateGoogleCalendarProvider,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
