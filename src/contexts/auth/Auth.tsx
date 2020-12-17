import * as React from 'react';
import User from 'lib/user';
import firebase from 'lib/firebase';

interface IAuthContext {
  signInWithGoogle: () => Promise<void>;
}

const defaultContext: IAuthContext = {
  signInWithGoogle: () => Promise.resolve(),
};

const AuthContext = React.createContext<IAuthContext>(defaultContext);

interface AuthContextProviderProps {
  children: (user: User) => React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children
}) => {
  const [user, setUser] = React.useState<User>(new User);

  const signInWithGoogle = async () => {
    try {
      await firebase.signInWithGoogle();
    } catch {
      setUser(new User);
    }
  };

  React.useEffect(() => {
    const unsubsciber = firebase.onAuthStateChange(setUser);
    return unsubsciber;
  }, []);


  const value: IAuthContext = { signInWithGoogle };

  return (
    <AuthContext.Provider value={value}>
      {children(user)}
    </AuthContext.Provider>
  );

};

export default AuthContext;
