import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logout from './Logout';
import AllListings from './AllListings';
import HostedListings from './HostedListings';
import Register from './Register';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position='fixed'
      style={{ backgroundColor: '#1976d2', color: '#fff' }}
      sx={{
        left: 0,
        minWidth: '400px',
        height: '60px',
      }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color='inherit'
          aria-label={localStorage.getItem('page')}
          style={{ fontSize: '12pt' }}
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/');
          }}>
          {localStorage.getItem('page')}
        </Button>
        <div style={{ display: 'flex' }}>
          {localStorage.getItem('token') !== null && (
            <>
              <HostedListings />
              <AllListings />
            </>
          )}
          <Logout />
          {localStorage.getItem('token') === null && <Register />}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
