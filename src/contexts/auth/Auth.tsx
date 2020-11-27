import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';

interface IAuthContext {
  signInWithGoogle: () => void;
}

const defaultContext: IAuthContext = {
  signInWithGoogle: () => undefined,
};

const AuthContext = React.createContext<IAuthContext>(defaultContext);
//const [storedUser, setStoredUser] = React.useState<UserDocument | null>(null);

interface AuthContextProviderProps {
  children: (user: User) => React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children
}) => {
  const [user, setUser] = React.useState<User>(new User);

  const value: IAuthContext = {
    signInWithGoogle: () => firebase.signInWithGoogle(),
  };

  React.useEffect(() => {
    const unsubsciber = firebase.onAuthStateChange(setUser);
    firebase.onRedirectComplete();

    return unsubsciber;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children(user)}
    </AuthContext.Provider>
  );

};

export default AuthContext;
