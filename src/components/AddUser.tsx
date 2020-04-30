import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import { useHistory, Redirect } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#31BBF3',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  }),
);

const AddUser = (props: any) => {
  const classes = useStyles();
  let history = useHistory();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);

  const hasState = () => {
    return !!props.location.state ? false : true
  }
  const [toDashboard, setToDashboard] = useState(hasState);
  const state = props.location.state;

  useEffect(() => {
    if (name.trim() && role.trim() && email.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, role, email, password]);

  const handleAddUser = async () => {
    const response = await addUser()
    if (!!response.message) {
      if (response.message === 'Invalid token') {
        history.push('/login')
      }
      setError(true)
      setHelperText(response.message)
    } else {
      setToDashboard(true)
    }
  };

  const addUser = async (): Promise<any> => {
    const response = await fetch(`http://demo-api.hikmahealth.org/admin_api/user`, {
      method: 'POST',
      headers: {
        Authorization: state.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "role": role.toLowerCase(),
        "email": email,
        "password": password,
      })
    });
    return await response.json();
  }

  const handleKeyPress = (e: any) => {
    setError(false)
    setHelperText('')
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleAddUser();
    }
  };

  return toDashboard ? (<Redirect to={{ pathname: '/home', state }}></Redirect>) : (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='New User' />
          <CardContent>
            <div>
              <TextField
                error={error}
                fullWidth
                id="name"
                type="text"
                label="Full Name"
                placeholder="Full Name"
                margin="normal"
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="role"
                type="text"
                label="Role"
                placeholder="Role"
                margin="normal"
                helperText={helperText}
                onChange={(e) => setRole(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="email"
                type="email"
                label="Email"
                placeholder="Email"
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />

            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={() => handleAddUser()}
              disabled={isButtonDisabled}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default AddUser;