import React from 'react';
import { TextField, FormControl, Box, Paper, InputAdornment, IconButton } from '@material-ui/core';
import { apiRequest } from '../Api';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const Login = () => {
  const [email, setemail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();

  document.title = 'Login';

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/');
    }
  }, []);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const login = () => {
    const data = { email, password };
    apiRequest('user/auth/login', data, 'POST')
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
        login();
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
            onChange={(e) => setemail(e.target.value)}
          />
          <TextField
            required
            type={values.showPassword ? 'text' : 'password'}
            id='password-input'
            label='Password'
            defaultValue=''
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'>
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <PrimaryButton name='Log In' onClick={() => login()} />
          <br />
          <SecondaryButton name='Back to Homepage' onClick={() => navigate('/')} />
        </FormControl>
      </Paper>
    </Box>
  );
};

export default Login;
