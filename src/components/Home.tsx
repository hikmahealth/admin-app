import React, { useState, useEffect, useRef } from 'react';
import User from '../types/User'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar, Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import AppBar from '@material-ui/core/AppBar';
import { useHistory, Redirect } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: 500,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    root: {
      width: '100%',
      maxWidth: 600,
      backgroundColor: theme.palette.background.paper,
    },
    btn: {
      margin: theme.spacing(2),
    },
    btnRow: {
      margin: theme.spacing(2),
      width: '100%'
    },
    btnRowContainer: {
      flexDirection: "row",
      justifyContent: 'stretch',
      display: 'flex'
    },
    header: {
      textAlign: 'center',
      background: '#31BBF3',
      color: '#fff',
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: 'flex-start',
      display: 'flex',
      padding: 20,
      alignItems: 'center'
    },
    icon: {
      height: 30,
      width: 30
    }
  }));

const Home = (props: any) => {
  const classes = useStyles();
  let history = useHistory();
  const loggedInEmail = (!!props.location.state) ? props.location.state.loggedInEmail : '';

  const getToken = () => {
    return !!props.location.state ? props.location.state.token : ''
  }
  const [token, setToken] = useState(getToken);
  const [users, setUsers] = useState([]);
  const [deleteUserEmail, setDeleteUserEmail] = useState('');
  const [fileChosen, setFileChosen] = useState();
  const uploadInput: any = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUsers().then((response: any) => {
      if (response.message === 'Invalid token') {
        setToken('')
      }
      setUsers(response.users)
    })
  }, [])



  const handleAddUser = () => {
    history.push({
      pathname: '/add-user',
      state: {
        loggedInEmail,
        token
      }
    })
  }

  const handleExportPatients = () => {
    history.push({
      pathname: '/export-patients',
      state: {
        loggedInEmail,
        token
      }
    })
  }

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/logout`, {
      method: 'POST',
      headers: {
        Authorization: token
      },
    }).then((response) => {
      if (response.status === 200) {
        setToken('')
      }
    });
  }

  const handleChangePassword = (user: User) => {
    history.push({
      pathname: '/password-reset',
      state: {
        loggedInEmail,
        user,
        token
      }
    })
  }

  const handleDeleteDialogOpen = (email: string) => {
    setDeleteUserEmail(email)
  }
  const handleDeleteDialogClose = () => {
    setDeleteUserEmail('')
  }
  const handleDeleteDialogConfirm = async () => {
    if (!!deleteUserEmail) {
      const response = await deleteUser(deleteUserEmail)
      setUsers(response.users)
    }
    setDeleteUserEmail('')
  }

  const deleteUser = async (email: string): Promise<any> => {
    const response = await fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/user`, {

      method: 'DELETE',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
      })
    });
    return await response.json();
  }

  const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/all_users`, {
      method: 'GET',
      headers: {
        Authorization: token
      }
    });
    return await response.json();
  }

  const handleUploadImage = () => {
    const data = new FormData();
    if (!!fileChosen) {
      data.append('file', fileChosen);
    }

    fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/upload`, {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: data,
    }).then((response) => {
      if (response.status === 200) {
        setFileChosen(null)
      }
    });
  }

  const UserList = () => {
    const listItems = users.map((user: User) => {
      return (
        <ListItem key={user.id}>
          <ListItemIcon  >
            <IconButton onClick={() => handleChangePassword(user)}>
              <CreateIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText
            primary={user.name.content[Object.keys(user.name.content)[0]]}
            secondary={user.role}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => handleDeleteDialogOpen(user.email)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>)
    })
    return (
      <List className={classes.root}>{listItems}</List>
    )
  }

  const FileUpload = () => {
    return (
      <div>
        <Button
          variant="contained"
          size="large"
          color="default"
          className={classes.btn}
          component="label">
          Upload Patient Data
        <input type="file" ref={uploadInput} onInput={() => setFileChosen(uploadInput.current.files[0])} style={{ display: 'none' }} />

        </Button>


        {!!fileChosen ? <label>{fileChosen.name}</label> : <div />}

        {!!fileChosen ?
          <div>
            <Button
              variant="contained"
              size="small"
              color="default"
              className={classes.btn}
              onClick={() => setFileChosen(null)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              color="default"
              className={classes.btn}
              onClick={handleUploadImage}>
              Upload
            </Button>
          </div>
          : <div />}
      </div>
    )
  }

  return !!token ? (
    <React.Fragment>
      <div className={classes.container}>
        <AppBar position='static' className={classes.header}>
          <div className={classes.headerRow}>
            <Avatar>
              <img className={classes.icon} src={require("../Images/hikma-logo-no-text.png")} />
            </Avatar>
            <Typography variant="h5" style={{paddingLeft: 20}}>
              Hikma Health Admin
          </Typography>
          </div>
        </AppBar>
        <h3 className={classes.btn}>Welcome, {loggedInEmail}
          <Button
            variant="contained"
            size="large"
            color="default"
            className={classes.btn}
            onClick={() => handleLogout()}>
            Logout
        </Button>
        </h3>
        <FileUpload />
        <div className={classes.btnRowContainer}>
          <Button
            variant="contained"
            size="large"
            color="default"
            className={classes.btnRow}
            onClick={() => handleAddUser()}>
            Add User
        </Button>
          <Button
            variant="contained"
            size="large"
            color="default"
            className={classes.btnRow}
            onClick={() => handleExportPatients()}>
            Export Patient Data
        </Button>
        </div>
        <UserList />
        <Dialog
          open={!!deleteUserEmail}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be reversed
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
          </Button>
            <Button onClick={handleDeleteDialogConfirm} color="primary" autoFocus>
              Confirm
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  ) : (<Redirect to='/login'></Redirect>)
}

export default Home;