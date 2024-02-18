import { Checkbox, FormControlLabel, FormLabel } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const AmenityCheckboxes = ({ onChange, amenities }) => {
  return (
    <>
      <FormLabel>Select Amenities</FormLabel>
      <FormControlLabel
        control={<Checkbox checked={amenities.pool} onChange={onChange} name='pool' />}
        label='A Pool'
      />
      <FormControlLabel
        control={<Checkbox checked={amenities.wifi} onChange={onChange} name='wifi' />}
        label='Wi-Fi Included'
      />
      <FormControlLabel
        control={
          <Checkbox checked={amenities.kitchen} onChange={onChange} name='kitchen' />
        }
        label='Kitchen Included'
      />
      <FormControlLabel
        control={
          <Checkbox checked={amenities.parking} onChange={onChange} name='parking' />
        }
        label='Free Parking'
      />
      <FormControlLabel
        control={
          <Checkbox checked={amenities.jacuzzi} onChange={onChange} name='jacuzzi' />
        }
        label='Jacuzzi Included'
      />
      <FormControlLabel
        control={
          <Checkbox checked={amenities.washing} onChange={onChange} name='washing' />
        }
        label='Washing Machine and/or Dryer'
      />
      <FormControlLabel
        control={
          <Checkbox checked={amenities.airCon} onChange={onChange} name='airCon' />
        }
        label='Air conditioning and/or heating'
      />
      <FormControlLabel
        control={<Checkbox checked={amenities.pets} onChange={onChange} name='pets' />}
        label='Pet Friendly'
      />
    </>
  )
}

AmenityCheckboxes.propTypes = {
  onChange: PropTypes.func.isRequired,
  amenities: PropTypes.objectOf(PropTypes.bool).isRequired
};

export default AmenityCheckboxes;
