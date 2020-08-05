import React, { useState, useEffect, useRef } from 'react';
import User from '../types/User'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, TextField, Paper } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory, Redirect } from 'react-router';
import download from 'downloadjs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: 500,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    list: {
      width: '100%',
      maxWidth: 600,
      backgroundColor: theme.palette.background.paper,
    },
    listContainer: {
      maxHeight: '47vh',
      overflow: 'auto',
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
      display: 'flex',
      flex: 1
    },
    title: {
      flexDirection: "row",
      justifyContent: 'center',
      display: 'flex',
      paddingTop: 10
    }
  }));

const PatientExport = (props: any) => {
  const classes = useStyles();
  let history = useHistory();
  const loggedInEmail = (!!props.location.state) ? props.location.state.loggedInEmail : '';

  const getToken = () => {
    return !!props.location.state ? props.location.state.token : ''
  }
  const [token, setToken] = useState(getToken);
  const [patients, setPatients] = useState([]);
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');

  useEffect(() => {
    getPatients().then((response: any) => {
      if (response.message === 'Invalid token') {
        setToken('')
      }
      setPatients(response.patients)
    })
  }, [])


  const backToUsers = () => {
    history.push({
      pathname: '/home',
      state: {
        loggedInEmail,
        token
      }
    })
  }
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      searchPatients()
    }
  }

  const getPatients = async (): Promise<User[]> => {
    const response = await fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/all_users`, {
      method: 'GET',
      headers: {
        Authorization: token
      }
    });
    return await response.json();
  }

  const searchPatients = async () => {
    fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/all_users`, {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        "given_name": givenName,
        "surname": surname,
        "country": country,
        "hometown": hometown,
      })
    }).then((response: any) => {
      response.json().then((res: any) => {
        console.log(res)
        setPatients(res.patient)
      })
    })
  }

  const handleExportAllPatients = () => {
    fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/export`, {
      method: 'POST',
      headers: {
        Authorization: token
      }
    }).then((response) => {
      return response.blob()
    }).then(blob => {
      download(blob)
    })
  }

  const handleExportSinglePatient = (patientId: string) => {
    fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/export_patient`, {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        "patient_id": patientId
      })
    }).then((response) => {
      return response.blob()
    }).then(blob => {
      download(blob)
    })
  }


  const PatientList = () => {
    const listItems = patients.map((patient: any) => {
      return (
        <ListItem key={patient.id}>
          <ListItemText
            primary={patient.given_name.content[Object.keys(patient.given_name.content)[0]]}
            secondary={patient.surname.content[Object.keys(patient.surname.content)[0]]}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => {
              handleExportSinglePatient(patient.id)
            }}>
              <ImportExportIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>)
    })
    return (
      <Paper className={classes.listContainer}>
        <List className={classes.list}>{listItems}</List>
      </Paper>
    )
  }

  return !!token ? (
    <React.Fragment>
      <div className={classes.container}>
        <h2 className={classes.btn}>Patient Export Options
          <Button
            variant="contained"
            size="large"
            color="default"
            className={classes.btn}
            onClick={() => backToUsers()}>
            Back to Users
        </Button>
        </h2>
        <div className={classes.btnRowContainer}>
          <Button
            variant="contained"
            size="large"
            color="default"
            className={classes.btnRow}
            onClick={() => handleExportAllPatients()}>
            Export All Patients
        </Button>
        </div>
        <h3 className={classes.title}>Patient Search
          <SearchIcon style={{ paddingLeft: 10, cursor: 'pointer' }}
            onClick={() => {
              searchPatients()
            }} />
        </h3>
        <div className={classes.btnRowContainer}>
          <TextField
            className={classes.btnRow}
            label="First Name"
            value={givenName}
            onChange={(event) => setGivenName(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <TextField
            className={classes.btnRow}
            label="Surname"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className={classes.btnRowContainer}>
          <TextField
            className={classes.btnRow}
            label="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <TextField
            className={classes.btnRow}
            label="Hometown"
            value={hometown}
            onChange={(event) => setHometown(event.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <PatientList />

      </div>
    </React.Fragment >
  ) : (<Redirect to='/login'></Redirect>)
}

export default PatientExport;