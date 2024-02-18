import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Rating } from '@mui/material';
import { TextField, Typography } from '@material-ui/core';
import { apiRequest } from '../Api';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  minWidth: '250px',
  padding: '20px',
  placeContent: 'center',
  display: 'flex',
  flexDirection: 'column',
};

const LeaveReviewModal = (bookingId) => {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
    setRating(0);
    setComment('');
  };
  const handleClose = () => {
    setOpen(false);
  };

  const submitReview = () => {
    if (rating === 0) {
      alert('Rating must be a star value between 1 and 5');
      return;
    }
    const data = {
      review: { rating, comment },
    };
    apiRequest(
      `listings/${window.location.href.split('/')[4]}/review/${bookingId.bookingId}`,
      data,
      'PUT'
    )
      .then(() => {
        alert('Review successfully submitted');
        navigate(0);
      })
      .catch((error) => {
        console.log(error.error)
      })
    handleClose();
  };

  return (
    <div>
      <PrimaryButton name='Add Review' onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <Typography component='legend'>Select Rating</Typography>
          <Rating
            name='star-rating'
            value={rating}
            onChange={(value, newValue) => {
              setRating(newValue);
            }}
          />
          <br />
          <TextField
            id='review-comment'
            label='Add comment (Optional)'
            variant='outlined'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <PrimaryButton name='Submit Review' onClick={submitReview} />
        </Box>
      </Modal>
    </div>
  );
};

LeaveReviewModal.propTypes = {
  bookingId: PropTypes.number.isRequired,
};

export default LeaveReviewModal;
