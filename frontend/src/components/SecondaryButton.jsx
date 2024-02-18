import React from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const SecondaryButton = ({ name, onClick }) => {
  return (
    <Button aria-label={name} variant='contained' color='secondary' onClick={onClick}>
      {name}
    </Button>
  );
};

SecondaryButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default SecondaryButton;
