import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { apiRequest } from '../Api';
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

const MakeBookingModal = (props) => {
  const navigate = useNavigate();
  const availabilities = props.availabilities;
  const price = props.price;

  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [submit, setSubmit] = React.useState(false);
  const [owner, setOwner] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setSubmit(checkDates());
  }, [startDate, endDate]);

  const checkDates = () => {
    if (!startDate || !endDate) {
      return false;
    }
    if (startDate - endDate > 0) {
      return false;
    }
    let inRange = false;
    for (const availability of availabilities) {
      if (startDate - availability.start >= 0) {
        if (endDate - availability.end <= 0) {
          inRange = true;
        }
      }
    }
    if (!inRange) {
      return false;
    }
    return true;
  };

  const makeBooking = () => {
    const data = {
      dateRange: { start: startDate, end: endDate },
      totalPrice: price * ((endDate - startDate) / (1000 * 60 * 60 * 24)),
    };
    if (startDate === endDate) {
      alert('The start date cannot be equal to the end date');
      return;
    }
    // Catch is if the user that makes the booking is the one that owns the booking
    apiRequest(`bookings/new/${window.location.href.split('/')[4]}`, data, 'POST')
      .then(() => {
        alert('Booking request sent');
        navigate(0);
      })
      .catch((err) => alert(err.error));
    handleClose();
  };

  React.useEffect(() => {
    apiRequest(`listings/${window.location.href.split('/')[4]}`, undefined, 'GET')
      .then((json) => {
        setOwner(json.listing.owner === localStorage.getItem('email'));
      })
      .catch((error) => {
        console.log(error.error)
      })
  }, [])

  return (
    <div>
      {!owner && <PrimaryButton name='Make Booking' onClick={handleOpen} />}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <TextField
            id='start-date'
            label='Start Date'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(Date.parse(e.target.value))}
          />
          <br />
          <TextField
            id='end-date'
            label='End Date'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setEndDate(Date.parse(e.target.value))}
          />
          <br />
          <Button
            onClick={makeBooking}
            disabled={!submit}
            id='submit-booking'
            aria-label='Submit Booking'
            variant='contained'
            color='primary'>
            Submit Booking
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

MakeBookingModal.propTypes = {
  availabilities: PropTypes.array.isRequired,
  price: PropTypes.number.isRequired,
};

export default MakeBookingModal;
