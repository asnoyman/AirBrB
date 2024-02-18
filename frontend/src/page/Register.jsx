import React from 'react';
import { TextField, FormControl, Paper, Box, InputAdornment, IconButton, FormHelperText } from '@material-ui/core';
import { apiRequest } from '../Api';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const Register = () => {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const [valuesConfirm, setValuesConfirm] = React.useState({
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

  document.title = 'Register';

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/');
    }
  }, []);

  React.useEffect(() => {
    const length = document.getElementById('password-length');
    const number = document.getElementById('password-number');
    const capital = document.getElementById('password-capital');
    const lowercase = document.getElementById('password-lowercase');
    const special = document.getElementById('password-special');

    if (password.length < 8) {
      length.style.color = 'red';
    } else {
      length.style.color = 'green';
    }

    if (!/\d/.test(password)) {
      number.style.color = 'red';
    } else {
      number.style.color = 'green';
    }

    if (password === password.toLowerCase()) {
      capital.style.color = 'red';
    } else {
      capital.style.color = 'green';
    }

    if (password === password.toUpperCase()) {
      lowercase.style.color = 'red';
    } else {
      lowercase.style.color = 'green';
    }

    if (!specialCharacters.test(password)) {
      special.style.color = 'red';
    } else {
      special.style.color = 'green';
    }

    if (password === '') {
      length.style.color = 'grey';
      number.style.color = 'grey';
      capital.style.color = 'grey';
      lowercase.style.color = 'grey';
      special.style.color = 'grey';
    }
  }, [password]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleClickShowPasswordConfirm = () => {
    setValuesConfirm({
      ...valuesConfirm,
      showPassword: !valuesConfirm.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const register = (email, name, password, password2) => {
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    if (!(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Z|a-z]{2,}/).test(email)) {
      alert('Invalid form of email');
      return;
    }
    if (password.length < 8 || !specialCharacters.test(password) || password === password.toLowerCase() || password === password.toUpperCase() || !/\d/.test(password)) {
      alert('Your password must be at least 8 characters long and contain at least one: capital letter, lower case letter, number and special character');
      return;
    }
    const data = { email, password, name };
    apiRequest('user/auth/register', data, 'POST')
      .then((json) => {
        localStorage.setItem('token', json.token);
        localStorage.setItem('email', email);
        navigate('/');
      })
      .catch((error) => {
        alert(error.error);
      });
  };

  React.useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        register(email, name, password, password2);
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  return (
    <Box style={{ display: 'flex', placeContent: 'center', marginTop: '30vh' }}>
      <Paper style={{ padding: '20px', placeContent: 'center', display: 'flex' }}>
        <FormControl>
          <TextField
            required
            id="email-input"
            label="Email"
            defaultValue=""
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            id="name-input"
            label="Name"
            defaultValue=""
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            type={values.showPassword ? 'text' : 'password'}
            id="password-input"
            label="Password"
            defaultValue=""
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormHelperText id="password-length">Password must contain at least 8 characters</FormHelperText>
          <FormHelperText id="password-number">Password must contain at least 1 number</FormHelperText>
          <FormHelperText id="password-capital">Password must contain at least 1 capital letter</FormHelperText>
          <FormHelperText id="password-lowercase">Password must contain at least 1 lowercase letter</FormHelperText>
          <FormHelperText id="password-special">Password must contain at least 1 special character</FormHelperText>
          <TextField
            required
            type={valuesConfirm.showPassword ? 'text' : 'password'}
            id="password2-input"
            label="Confirm Password"
            defaultValue=""
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {valuesConfirm.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            }}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <br />
          <PrimaryButton name='Register' onClick={() => register(email, name, password, password2)} />
          <br />
          <SecondaryButton name='Back to Homepage' onClick={() => navigate('/')} />
        </FormControl>
      </Paper>
    </Box >
  );
};

export default Register;
