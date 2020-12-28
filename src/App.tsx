import * as React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import SignIn from './views/sign-in';
import Home from './views/home';
import {AuthContextProvider} from 'contexts/auth';
import {UserContextProvider} from 'contexts/user';
import {CalendarRequesterContextProvider} from 'contexts/calendar-requester';
import 'react-datepicker/dist/react-datepicker.css';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      {(user) => (
        <UserContextProvider user={user}>
          <CalendarRequesterContextProvider>
            <Router forceRefresh={false}>
              <Switch>
                <Route path='/sign-in'>
                  <SignIn />
                </Route>
                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
            </Router>
          </CalendarRequesterContextProvider>
        </UserContextProvider>
      )}
    </AuthContextProvider>
  );
};

export default App;
