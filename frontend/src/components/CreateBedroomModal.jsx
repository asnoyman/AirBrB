import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FormControl, TextField } from '@material-ui/core';
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

let bedrooms = null;

const CreateBedroomModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setBeds({
      'Super King': 0,
      King: 0,
      Queen: 0,
      Double: 0,
      'King Single': 0,
      Single: 0,
    });
  };
  const handleClose = () => setOpen(false);
  const [rooms, setRooms] = React.useState([]);
  const [beds, setBeds] = React.useState({
    'Super King': 0,
    King: 0,
    Queen: 0,
    Double: 0,
    'King Single': 0,
    Single: 0,
  });

  React.useEffect(() => {
    // Show the number of bed in the room, if it is greater than 0
    if (rooms.length !== 0) {
      if (beds['Super King']) {
        document.getElementById(
          `SuperKing${rooms.length}`
        ).textContent = `Number of Super Kings: ${beds['Super King']}`;
      }
      if (beds.King) {
        document.getElementById(
          `King${rooms.length}`
        ).textContent = `Number of Kings: ${beds.King}`;
      }
      if (beds.Queen) {
        document.getElementById(
          `Queen${rooms.length}`
        ).textContent = `Number of Queens: ${beds.Queen}`;
      }
      if (beds.Double) {
        document.getElementById(
          `Double${rooms.length}`
        ).textContent = `Number of Doubles: ${beds.Double}`;
      }
      if (beds['King Single']) {
        document.getElementById(
          `KingSingle${rooms.length}`
        ).textContent = `Number of King Singles: ${beds['King Single']}`;
      }
      if (beds.Single) {
        document.getElementById(
          `Single${rooms.length}`
        ).textContent = `Number of Singles: ${beds.Single}`;
      }
    }
  }, [rooms]);

  const changeBeds = (event) => {
    setBeds({
      ...beds,
      [event.target.name]: event.target.value,
    });
  };

  const addBeds = () => {
    const bedCopy = {
      'Super King': 0,
      King: 0,
      Queen: 0,
      Double: 0,
      'King Single': 0,
      Single: 0,
    };
    let found = false;
    for (const [key, value] of Object.entries(beds)) {
      if (!/^\d+$/.test(value) && value !== '') {
        alert('Number of beds must be a positive integer');
        return;
      } else if (value === '' || value === '0' || value === 0) {
        bedCopy[key] = 0;
      } else {
        bedCopy[key] = parseInt(value);
        found = true;
      }
    }
    if (!found) {
      alert('There must be at least one bed');
      return;
    }
    setBeds(bedCopy, createBedroom(bedCopy));
    handleClose();
  };

  const createBedroom = (beds) => setRooms([...rooms, beds]);

  const generateRoom = (roomNum) => {
    return (
      <div key={roomNum}>
        Room {roomNum}:<div id={`SuperKing${roomNum}`} key={`SuperKing${roomNum}`}></div>
        <div id={`King${roomNum}`} key={`King${roomNum}`}></div>
        <div id={`Queen${roomNum}`} key={`Queen${roomNum}`}></div>
        <div id={`Double${roomNum}`} key={`Double${roomNum}`}></div>
        <div id={`KingSingle${roomNum}`} key={`KingSingle${roomNum}`}></div>
        <div id={`Single${roomNum}`} key={`Single${roomNum}`}></div>
        <br />
      </div>
    );
  };

  const generateRooms = () => {
    bedrooms = rooms;
    const listOfRooms = [];
    for (let i = 1; i <= rooms.length; i++) {
      listOfRooms.push(generateRoom(i));
    }
    return listOfRooms;
  };

  // Scroll to bottom of bed div whenever beds are added
  React.useEffect(() => {
    document.getElementById('bedroomDiv').scrollTop =
      document.getElementById('bedroomDiv').scrollHeight;
  }, [rooms])

  return (
    <div>
      <div id='bedroomDiv' style={{ maxHeight: '20vh', overflowY: 'scroll' }}>
        {generateRooms()}
      </div>
      <PrimaryButton name='Add Bedroom' onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <p id='bedroom-modal-header' style={{ textAlign: 'center', margin: 0, minWidth: '265px' }}>
            How many beds in this room of type:
          </p>
          <FormControl>
            <TextField
              key='Super King'
              name='Super King'
              label='Super King'
              onChange={(e) => changeBeds(e)}
            />
            <TextField key='King' name='King' label='King' onChange={(e) => changeBeds(e)} />
            <TextField key='Queen' name='Queen' label='Queen' onChange={(e) => changeBeds(e)} />
            <TextField key='Double' name='Double' label='Double' onChange={(e) => changeBeds(e)} />
            <TextField
              key='King Single'
              name='King Single'
              label='King Single'
              onChange={(e) => changeBeds(e)}
            />
            <TextField key='Single' name='Single' label='Single' onChange={(e) => changeBeds(e)} />
          </FormControl>
          <br />
          <PrimaryButton name='Add Beds' onClick={addBeds} />
        </Box>
      </Modal>
    </div>
  );
};

export default CreateBedroomModal;
export const getRooms = () => {
  return bedrooms;
};
