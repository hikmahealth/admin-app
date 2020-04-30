import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import { useHistory, Redirect } from 'react-router-dom';

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

const PasswordReset = (props: any) => {
  const classes = useStyles();
  let history = useHistory();
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
    if (passwordConfirm.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [passwordConfirm, password]);

  const handlePasswordReset = async () => {
    if (passwordConfirm === password) {
      const responseJson = await changePassword();
      if (responseJson.message === 'ok') {
        setError(false);
        setHelperText('Password Changed Successfully');
        setToDashboard(true)
      } else if (responseJson.message === 'Invalid token') {
        history.push('/login')
      } else {
        setError(true);
        setHelperText(responseJson.message)
      }

    } else {
      setError(true);
      setHelperText('Passwords do not match')
    }
  };

  const changePassword = async (): Promise<any> => {
    const response = await fetch(`http://demo-api.hikmahealth.org/admin_api/change_password`, {
      method: 'POST',
      headers: {
        Authorization: state.token
      },
      body: JSON.stringify({
        "email": state.user.email,
        "new_password": password,
      })
    });
    return await response.json();
  }

  const handleKeyPress = (e: any) => {
    setError(false)
    setHelperText('')
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handlePasswordReset();
    }
  };

  return toDashboard ? (<Redirect to={{ pathname: '/home', state }}></Redirect>) : (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title={`Reset Password for ${state.user.name.content[Object.keys(state.user.name.content)[0]]}`} />
          <CardContent>
            <div>
              <TextField
                error={error}
                fullWidth
                id="password"
                type="password"
                label="New password"
                placeholder="New password"
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <TextField
                error={error}
                fullWidth
                id="confirmPassword"
                type="password"
                label="Confirm new password"
                placeholder="Confirm new password"
                margin="normal"
                helperText={helperText}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
              onClick={() => handlePasswordReset()}
              disabled={isButtonDisabled}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default PasswordReset;