import * as React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import SignIn from './views/sign-in';
import Home from './views/home';
import {AuthContextProvider} from 'contexts/auth';
import {UserContextProvider} from 'contexts/user';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      {(user) => (
        <UserContextProvider user={user}>
          <Router forceRefresh={false}>
            <Link to="/"><h1>Calendar Gap</h1></Link>
            <Switch>
              <Route path='/sign-in'>
                <SignIn />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </Router>
        </UserContextProvider>
      )}
    </AuthContextProvider>
  );
};

export default App;
