import React from 'react';
import { Slider } from '@material-ui/core';
import PropTypes from 'prop-types';

const FilterSlider = ({ setValue, onChange, min, max, marks }) => {
  const slider = {
    width: '75%',
    marginRight: '5%',
  }

  return (
    <Slider
      value={setValue}
      onChange={onChange}
      valueLabelDisplay="auto"
      marks={marks}
      valueLabelFormat={(value) => {
        if (value === max) {
          return <div>{value}+</div>
        }
        return value
      }}
      min={min}
      max={max}
      style={slider}
    />
  );
};

FilterSlider.propTypes = {
  setValue: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  marks: PropTypes.bool.isRequired
};

export default FilterSlider;
