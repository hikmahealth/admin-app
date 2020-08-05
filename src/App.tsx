import React from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route, Redirect, } from 'react-router-dom';
import PasswordReset from './components/PasswordReset';
import AddUser from './components/AddUser';
import PatientExport from './components/PatientExport';

const App: React.FC = () => {

  return (
    <main>
      <Router>
        <Switch>
          <Route path='/login' >
            <Login />
          </Route>
          <Route
            path='/home'
            render={(props) => <Home {...props} />}
          />
          <Route
            path='/password-reset'
            render={(props) => <PasswordReset {...props} />}
          />
          <Route
            path='/add-user'
            render={(props) => <AddUser {...props} />}
          />
          <Route
            path='/export-patients'
            render={(props) => <PatientExport {...props} />}
          />
          <Route exact path='/' >
            <Redirect to='/login' />
          </Route>

        </Switch>
      </Router>
    </main>
  );
}

export default App;
