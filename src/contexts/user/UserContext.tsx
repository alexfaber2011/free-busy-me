import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';
import { UserDocument } from 'lib/firebase/users';
import GoogleRequester from 'lib/calendars/google';

type CalendarProviders = UserDocument['calendarProviders'];

interface IUserContext {
  user: User;
  calendarProviders: CalendarProviders;
}

const defaultContext: IUserContext = {
  user: new User(),
  calendarProviders: {}
};

const UserContext = React.createContext<IUserContext>(defaultContext);

interface UserContextProviderProps {
  user: User;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  user,
  children
}) => {
  const [calendarProviders, setCalendarProviders] = React.useState<
    CalendarProviders
  >({});

  const storeCalendarProviders = (data: UserDocument) => {
    setCalendarProviders(data.calendarProviders);
  };

  const clearCalendarProviders = () => setCalendarProviders({});

  React.useEffect(() => {
    if (user.isSignedIn === false) return;

    return firebase.users.listen(
      user.id,
      storeCalendarProviders,
      clearCalendarProviders
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

  React.useEffect(() => {
    if (calendarProviders.google) {
      fetchCalendarList(calendarProviders.google.accessToken);
    }
  }, [calendarProviders]);

  const value = { user, calendarProviders };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );


};

export default UserContext;
