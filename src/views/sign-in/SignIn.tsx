import * as React from 'react';
import AuthContext from 'contexts/auth';


const SignInScreen: React.FC = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const { signInWithGoogle } = React.useContext(AuthContext);

  return (
    <>
      <h2>Sign In</h2>
      {/*
      <form id="signin" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <br />
      </form>
      <button form="signin" type="submit">Sign in</button>
      <button onClick={handleSignUp}>Sign up</button>
        */}
      <button onClick={signInWithGoogle}>Sign in</button>
    </>
  );
};

export default SignInScreen;
