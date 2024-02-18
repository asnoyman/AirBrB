import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';

const AllListings = () => {
  const navigate = useNavigate();

  const allListings = () => {
    window.scrollTo(0, 0);
    navigate('/')
  };

  return (
    <Button aria-label="All Listings" color="inherit" onClick={allListings}>
      All Listings
    </Button>
  );
};

export default AllListings;
