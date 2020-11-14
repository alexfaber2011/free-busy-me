import * as React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import SignInScreen from './views/sign-in/SignIn';
import {AuthContextProvider} from 'contexts/auth';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <h1>Calendar Gap</h1>
      <Router>
        <Switch>
          <Route path='/sign-in'>
            <SignInScreen />
          </Route>
          <Route path='/'>
            <h2>Welcome home</h2>
          </Route>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
