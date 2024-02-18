import React from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const PrimaryButton = ({ name, onClick }) => {
  return (
    <Button aria-label={name} variant='contained' color='primary' onClick={onClick}>
      {name}
    </Button>
  );
};

PrimaryButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PrimaryButton;
