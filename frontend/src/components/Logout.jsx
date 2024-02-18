import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { apiRequest } from '../Api';

const Logout = () => {
  const navigate = useNavigate();

  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      apiRequest('user/auth/logout', undefined, 'POST')
        .then(() => {
          localStorage.clear();
          navigate('/');
          navigate(0);
        })
        .catch((error) => {
          localStorage.clear();
          navigate('/');
          alert(error.error);
        });
    }
  };

  const login = () => {
    navigate('/login');
  };

  return (
    <Button aria-label={localStorage.getItem('token') !== null ? 'Logout' : 'Login'} color="inherit" onClick={localStorage.getItem('token') !== null ? logout : login}>
      {localStorage.getItem('token') !== null ? 'Logout' : 'Login'}
    </Button>
  );
};

export default Logout;
