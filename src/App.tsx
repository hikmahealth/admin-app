import React from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { BrowserRouter as Router, Switch, Route, Redirect, } from 'react-router-dom';
import PasswordReset from './components/PasswordReset';
import AddUser from './components/AddUser';

const App: React.FC = () => {

  // const [state, setState] = useState({
  //   currentUser: null,
  //   isAuthenticated: false,
  //   wasInitialized: false
  // })

  // useEffect(() => {
  //   // setLoggedInUser(localStorage.getItem('username'))
  // }, [localStorage.getItem('username')])

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
          <Route path='/' >
            <Redirect to='/login' />
          </Route>

        </Switch>
      </Router>
    </main>
  );
}

export default App;
