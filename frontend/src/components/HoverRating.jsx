import React from 'react';
import { Popover } from '@material-ui/core';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const HoverRating = ({ id, svg, ratingSpread }) => {
  const [openedPopover, setOpenedPopover] = React.useState(-1);
  const navigate = useNavigate();

  const popoverEnter = (id) => {
    setOpenedPopover(id);
  };

  const popoverLeave = () => {
    setOpenedPopover(-1);
  };

  React.useEffect(() => {
    localStorage.setItem('hoverOpen', openedPopover);
  }, [openedPopover])

  const linkStyle = {
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer'
  }

  const showReviews = (rating) => {
    navigate(`/view_reviews/${openedPopover}/${rating}`)
  }

  const showHover = (ratingSpread) => {
    return (
      <div style={linkStyle}>
        <div onClick={() => { showReviews(1) }} aria-label="1-star-ratings">
          1 star: {ratingSpread[0]} (
          {ratingSpread[5] === 0
            ? 0
            : Math.round((ratingSpread[0] / ratingSpread[5]) * 10000) / 100}
          %){' '}
        </div>
        <div onClick={() => { showReviews(2) }} aria-label="2-star-ratings">
          2 stars: {ratingSpread[1]} (
          {ratingSpread[5] === 0
            ? 0
            : Math.round((ratingSpread[1] / ratingSpread[5]) * 10000) / 100}
          %){' '}
        </div>
        <div onClick={() => { showReviews(3) }} aria-label="3-star-ratings">
          3 stars: {ratingSpread[2]} (
          {ratingSpread[5] === 0
            ? 0
            : Math.round((ratingSpread[2] / ratingSpread[5]) * 10000) / 100}
          %){' '}
        </div>
        <div onClick={() => { showReviews(4) }} aria-label="4-star-ratings">
          4 stars: {ratingSpread[3]} (
          {ratingSpread[5] === 0
            ? 0
            : Math.round((ratingSpread[3] / ratingSpread[5]) * 10000) / 100}
          %){' '}
        </div>
        <div onClick={() => { showReviews(5) }} aria-label="5-star-ratings">
          5 stars: {ratingSpread[4]} (
          {ratingSpread[5] === 0
            ? 0
            : Math.round((ratingSpread[4] / ratingSpread[5]) * 10000) / 100}
          %){' '}
        </div>
      </div>
    );
  };

  return (
    <span
      key={`svg${id}`}
      onMouseEnter={() => { popoverEnter(id) }}
      onMouseLeave={popoverLeave}
      aria-owns={openedPopover !== -1 ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      aria-label="hover-span"
    >
      <Rating
        name='half-rating-read'
        value={svg}
        precision={0.1}
        id={`svg${id}`}
        readOnly
      />
      <Popover
        id="mouse-over-popover"
        open={openedPopover !== -1 && openedPopover === id}
        style={{ pointerEvents: 'none' }}
        anchorEl={document.getElementById(`svg${id}`)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        onClose={popoverLeave}
        PaperProps={{ onMouseEnter: () => { popoverEnter(id) }, onMouseLeave: popoverLeave }}
      >
        <div style={{ pointerEvents: 'auto' }} aria-label="ratings">
          {ratingSpread[5] === 0
            ? 'No reviews yet'
            : `${svg} out of 5 from ${ratingSpread[5]} ${ratingSpread[5] === 1 ? 'review' : 'reviews'}`}
          {showHover(ratingSpread)}
        </div>
      </Popover>
    </span>
  );
}

HoverRating.propTypes = {
  id: PropTypes.node.isRequired,
  svg: PropTypes.node.isRequired,
  ratingSpread: PropTypes.array.isRequired,
};

export default HoverRating;
