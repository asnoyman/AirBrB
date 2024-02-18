import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@material-ui/core';
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

const CreateJSONModal = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(undefined);

  const handleOpen = () => {
    setOpen(true);
    setFile('');
  };
  const handleClose = () => {
    setOpen(false);
  };

  const clearFile = () => {
    document.getElementById('upload-json-file').value = '';
  };

  const submitReview = (file) => {
    if (file.type !== 'application/json') {
      alert('File must be json');
      clearFile();
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = async (e) => {
      const content = JSON.parse(e.target.result);
      if (!correctFormat(content)) {
        clearFile();
        return;
      }
      if (!validThumbnail(content)) {
        alert('The thumbnail url needs to be a jpeg, jpg or png or a youtube link');
        clearFile();
        return;
      }
      if (!validType(content.metadata.type)) {
        alert('The given type is not valid');
        clearFile();
        return;
      }
      if (!checkAmenities(content.metadata.amenities)) {
        clearFile();
        return;
      }
      if (!checkBedrooms(content.metadata.bedrooms)) {
        clearFile();
        return;
      }
      checkAddress(content)
        .then((jsonAddress) => {
          if (jsonAddress.status !== 'OK') {
            alert('You entered an invalid address');
            clearFile();
            return;
          }
          const newAddress = jsonAddress.results[0].formatted_address;
          content.address = newAddress;
          content.metadata.images = [content.thumbnail];
          apiRequest('listings/new', content, 'POST')
            .then(() => {
              handleClose();
              navigate(0);
            })
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };

  const validThumbnail = (content) => {
    let imageMatch = content.thumbnail.match(/\.(jpeg|jpg|png)$/) !== null;
    if (!imageMatch) {
      if (content.thumbnail.includes('www.youtube.com')) {
        content.thumbnail = content.thumbnail.replace('watch?v=', 'embed/');
        imageMatch = true;
      } else {
        imageMatch = false;
      }
    }
    return imageMatch;
  };

  const validType = (type) => {
    const types = [
      'House',
      'Apartment',
      'Self-contained Unit',
      'Bed and Breakfast',
      'Unique Space',
      'Boutique Hotel',
    ];
    return types.includes(type);
  };

  const checkAmenities = (amenities) => {
    const amenitiesList = [
      'pool',
      'wifi',
      'kitchen',
      'parking',
      'jacuzzi',
      'washing',
      'airCon',
      'pets',
    ];
    for (const amenity of amenitiesList) {
      if (amenities[`${amenity}`] !== true && amenities[`${amenity}`] !== false) {
        alert(`You didn't provide a valid input for amenity ${amenity}`);
        return false;
      }
    }
    return true;
  };

  const checkBedrooms = (bedrooms) => {
    const bedsList = ['Super King', 'King', 'Queen', 'Double', 'King Single', 'Single'];
    let roomNum = 1;
    for (const room of bedrooms) {
      for (const bed of bedsList) {
        if (!Number.isInteger(room[`${bed}`]) || room[`${bed}`] < 0) {
          alert(`You didn't provide a valid input for ${bed} in room ${roomNum}`);
          return false;
        }
      }
      roomNum += 1;
    }
    return true;
  };

  const checkAddress = (content) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://maps.google.com/maps/api/geocode/json?key=AIzaSyCHCLWbIP4SgOg70Eiy4tHZJC5iF_0Q6hc&address=${content.address}`
      )
        .then((response) => {
          if (response.status !== 200) {
            response.json().then((error) => {
              reject(error);
            });
          } else {
            response.json().then((json) => {
              resolve(json);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const correctFormat = (json) => {
    if (!('title' in json && typeof json.title === 'string')) {
      alert('Title should be a string');
      return false;
    }
    if (!('price' in json && typeof json.price === 'number')) {
      alert('Price should be a number');
      return false;
    }
    if (!('address' in json && typeof json.address === 'string')) {
      alert('Address should be a string');
      return false;
    }
    if (!('thumbnail' in json && typeof json.thumbnail === 'string')) {
      alert('Thumbnail should be a string');
      return false;
    }
    if (!('metadata' in json && typeof json.metadata === 'object')) {
      alert('Metadata should be an object');
      return false;
    }
    if (!('bathrooms' in json.metadata && typeof json.metadata.bathrooms === 'number')) {
      alert('Bathrooms should be a number');
      return false;
    }
    if (!('bedrooms' in json.metadata && typeof json.metadata.bedrooms === 'object')) {
      alert('Bedrooms should be an object');
      return false;
    }
    if (!('type' in json.metadata && typeof json.metadata.type === 'string')) {
      alert('Type should be a string');
      return false;
    }
    if (!('amenities' in json.metadata && typeof json.metadata.amenities === 'object')) {
      alert('Amenites should be an object');
      return false;
    }

    return true;
  };

  return (
    <>
      <Button
        id='new-listing-json'
        aria-label='Create New Listing (JSON)'
        variant='contained'
        color='secondary'
        onClick={handleOpen}
        style={{ margin: '10px' }}>
        Create New Listing (Json)
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <TextField
            id='upload-json-file'
            type='file'
            label='Upload JSON file'
            aria-label='upload-json-file'
            variant='outlined'
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />
          <PrimaryButton name='Create Listing' onClick={() => submitReview(file)} />
        </Box>
      </Modal>
    </>
  );
};

export default CreateJSONModal;
