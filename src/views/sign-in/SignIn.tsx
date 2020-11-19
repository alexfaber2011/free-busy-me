import * as React from 'react';
import AuthContext from 'contexts/auth';


const SignInScreen: React.FC = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const { signIn, signUp } = React.useContext(AuthContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signIn(email, password);
  };

  const handleSignUp = async () => {
    await signUp(email, password);
  };

  return (
    <>
      <h2>Sign In</h2>
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
    </>
  );
};

export default SignInScreen;
