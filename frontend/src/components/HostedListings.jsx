import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';

const HostedListings = () => {
  const navigate = useNavigate();

  const hostedListings = () => {
    window.scrollTo(0, 0);
    navigate('/hosted_listings');
  };

  return (
    <Button color='inherit' aria-label='Hosted Listings' onClick={hostedListings}>
      Hosted Listings
    </Button>
  );
};

export default HostedListings;
