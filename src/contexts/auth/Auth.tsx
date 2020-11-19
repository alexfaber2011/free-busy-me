import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';

interface IAuthContext {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<User>; // TODO - confirm password is the same
}

const defaultContext: IAuthContext = {
  user: new User(),
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(new User()),
};

const AuthContext = React.createContext<IAuthContext>(defaultContext);

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<User>(new User);

  const value: IAuthContext = {
    user,
    signIn: (email, password) => firebase.signIn(email, password),
    signUp: (email, password) => firebase.signUp(email, password),
  };

  React.useEffect(() => {
    console.log('User: ', user);
  }, [user]);

  React.useEffect(() => {
    // By returning the result of onAuthStateChange, this listener will
    // unsubscriber when this component unmounts
    return firebase.onAuthStateChange(setUser);
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;
