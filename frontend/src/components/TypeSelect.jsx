import { InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const TypeSelect = ({ onChange, value }) => {
  return (
    <>
      <InputLabel id='listing-label-id'>Property Type</InputLabel>
      <Select
        required
        labelId='listing-label-id'
        id='listing-type'
        label='Property Type'
        defaultValue={'House'}
        value={value}
        onChange={onChange}>
        <MenuItem value={'House'}>House</MenuItem>
        <MenuItem value={'Apartment'}>Apartment</MenuItem>
        <MenuItem value={'Self-contained Unit'}>Self-contained Unit</MenuItem>
        <MenuItem value={'Bed and Breakfast'}>Bed and Breakfast</MenuItem>
        <MenuItem value={'Unique Space'}>Unique Space</MenuItem>
        <MenuItem value={'Boutique Hotel'}>Boutique Hotel</MenuItem>
      </Select>
    </>
  )
}

TypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default TypeSelect;
