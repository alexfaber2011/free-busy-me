import * as React from 'react';
import AuthContext from 'contexts/auth';
import {Link} from 'react-router-dom';

const SignInScreen: React.FC = () => {
  const { signInWithGoogle } = React.useContext(AuthContext);

  return (
    <>
      <h2>Sign In</h2>
      <button onClick={() => signInWithGoogle()}>Sign in</button>
      <Link to="/">Home</Link>
    </>
  );
};

export default SignInScreen;
