import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@material-ui/core';
import { apiRequest } from '../Api';
import PropTypes from 'prop-types';
import SecondaryButton from './SecondaryButton'
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

const GoLiveModal = (id) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setDates([]);
  };
  const handleClose = () => setOpen(false);
  const [dates, setDates] = React.useState([]);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    apiRequest(`listings/${id.id}`, undefined, 'GET')
      .then((json) => {
        setLive(json.listing.published)
      })
      .catch((error) => {
        console.log(error.error)
      })
  }, []);

  const addDate = () => {
    if (!startDate || !endDate) {
      alert('Start and end date are both required to create an availability range');
      return;
    }
    if (startDate - new Date(Date.now()).setHours(0, 0, 0, 0) < 0) {
      alert('Start date must be today or later');
      return;
    }
    if (startDate - endDate >= 0) {
      alert('The end date must be after the the start date.');
      return;
    }
    setDates([...dates, { start: startDate, end: endDate }]);
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
  };

  const generateDates = () => {
    const dateList = [];
    for (const date of dates) {
      dateList.push(
        <div key={`date${dateList.length}`}>
          Start: {new Date(date.start).toLocaleDateString('en-AU')} - End:{' '}
          {new Date(date.end).toLocaleDateString('en-AU')}
        </div>
      );
    }
    return dateList;
  };

  const goLive = () => {
    if (dates.length === 0) {
      alert('You have not entered any availability dates');
      return;
    }
    apiRequest(`listings/publish/${id.id}`, { availability: dates }, 'PUT')
      .then(() => {
        setLive(!live);
      })
      .catch((error) => {
        alert(error.error);
      });
    setOpen(false);
  };

  const unpublish = async () => {
    if (window.confirm('Are you sure you want to unpublish this listing?')) {
      await apiRequest(`listings/unpublish/${id.id}`, {}, 'PUT')
        .then(() => {
          setLive(!live);
        })
        .catch((error) => {
          console.log(error.error)
        })
    }
  };

  return (
    <div>
      <SecondaryButton name={live ? 'Unpublish' : 'Go Live'} onClick={live ? unpublish : handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          {generateDates()}
          <TextField
            id='start-date'
            label='Start Date'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(Date.parse(e.target.value))}
          />
          <TextField
            id='end-date'
            label='End Date'
            type='date'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setEndDate(Date.parse(e.target.value))}
          />
          <Button id='add-date-button' aria-label='Add current Range' variant='outline' color='primary' onClick={addDate}>
            Add Current Range
          </Button>
          <PrimaryButton name='Submit All Dates' onClick={goLive} />
        </Box>
      </Modal>
    </div>
  );
};

GoLiveModal.propTypes = {
  id: PropTypes.number.isRequired,
};

export default GoLiveModal;
