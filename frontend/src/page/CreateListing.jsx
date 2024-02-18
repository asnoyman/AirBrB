import * as React from 'react';
import Header from '../components/Header';
import '../App.css';
import {
  FormControl,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { fileToDataUrl } from '../helpers';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useNavigate } from 'react-router-dom';
import CreateBedroomModal, { getRooms } from '../components/CreateBedroomModal';
import { apiRequest } from '../Api';
import CentredContainer from '../components/CentredContainer';
import TypeSelect from '../components/TypeSelect';
import AmenityCheckboxes from '../components/AmenityCheckboxes';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const CreateListing = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/');
    }
    window.scrollTo(0, 0)
  }, []);

  localStorage.setItem('page', 'Create Listing');
  document.title = 'Create Listing';

  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('House');
  const [numBaths, setNumBaths] = React.useState('0');
  const [thumbnail, setThumbnail] = React.useState(null);
  const [thumbnailType, setThumbnailType] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [amenities, setAmenities] = React.useState({
    pool: false,
    wifi: false,
    kitchen: false,
    parking: false,
    jacuzzi: false,
    washing: false,
    airCon: false,
    pets: false,
  });

  const changeAmenities = (event) => {
    setAmenities({
      ...amenities,
      [event.target.name]: event.target.checked,
    });
  };

  const createListing = () => {
    if (title === '') {
      alert("You didn't give your listing a title");
      return;
    }
    if (address === '') {
      alert("You didn't give your listing an address");
      return;
    }
    if (!/^\d+$/.test(price)) {
      alert('Price must be a positive integer.');
      document.getElementById('listing-num-bathrooms').value = '0';
      return;
    }
    if (getRooms().length === 0) {
      alert("You didn't add any bedrooms to your listing");
      return;
    }
    if (!/^\d+$/.test(numBaths)) {
      alert('Number of bathrooms must be a positive integer.');
      document.getElementById('listing-num-bathrooms').value = '0';
      return;
    }
    if (thumbnail !== null) {
      try {
        if (thumbnailType !== 'photo') {
          const newThumbnail = thumbnail.replace('watch?v=', 'embed/')
          const listing = {
            title,
            address,
            price: parseInt(price),
            thumbnail: newThumbnail,
            metadata: {
              type,
              bedrooms: getRooms(),
              bathrooms: parseInt(numBaths),
              amenities,
              images: [newThumbnail],
            },
          };
          apiRequest('listings/new', listing, 'POST')
            .then(() => {
              navigate('/hosted_listings');
            })
            .catch((error) => { console.log(error.error) })
        } else {
          fileToDataUrl(thumbnail)
            .then((data) => {
              const listing = {
                title,
                address,
                price: parseInt(price),
                thumbnail: data,
                metadata: {
                  type,
                  bedrooms: getRooms(),
                  bathrooms: parseInt(numBaths),
                  amenities,
                  images: [data],
                },
              };
              apiRequest('listings/new', listing, 'POST')
                .then(() => {
                  navigate('/hosted_listings');
                })
                .catch((error) => { console.log(error.error) })
            })
            .catch((error) => {
              document.getElementById('listing-thumbnail').value = '';
              console.log(error);
            });
        }
      } catch (error) {
        document.getElementById('listing-thumbnail').value = '';
      }
    } else {
      alert("You didn't enter a thumbnail");
    }
  };

  const { ref: materialRef } = usePlacesWidget({
    apiKey: 'AIzaSyCHCLWbIP4SgOg70Eiy4tHZJC5iF_0Q6hc',
    onPlaceSelected: (place) => {
      setAddress(place.formatted_address);
    },
    options: {
      types: ['geocode'],
    },
  });

  return (
    <>
      <Header />
      <CentredContainer>
        <FormControl>
          <TextField
            required
            id='listing-title'
            label='Title'
            defaultValue=''
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            required
            id='address'
            label='Address'
            inputRef={materialRef}
          />
          <FormControl>
            <TypeSelect onChange={(e) => { setType(e.target.value) }} value={type} />
          </FormControl>
          <CreateBedroomModal />
          <TextField
            required
            id='listing-num-bathrooms'
            label='Number of Bathrooms'
            onChange={(e) => setNumBaths(e.target.value)}
          />
          <div style={{ display: thumbnailType !== null ? 'none' : 'block' }}>
            <PrimaryButton name='Photo Thumbnail' onClick={() => setThumbnailType('photo')} />
            <PrimaryButton name='Youtube Thumbnail' onClick={() => setThumbnailType('youtube')} />
          </div>
          <TextField
            required
            type='file'
            id='listing-thumbnail'
            label='Thumbnail'
            defaultValue=''
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
            }}
            style={{ display: thumbnailType === 'photo' ? 'block' : 'none' }}
          />
          <TextField
            id='listing-thumbnail-youtube'
            label='Youtube Thumbnail Link'
            defaultValue=''
            fullWidth
            style={{ display: thumbnailType === 'youtube' ? 'block' : 'none' }}
            onChange={(e) => {
              setThumbnail(e.target.value);
            }}
          />
          <TextField
            required
            id='listing-price'
            label='Price per night ($AUD)'
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
            }}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
          <FormControl>
            <AmenityCheckboxes onChange={changeAmenities} amenities={amenities} />
          </FormControl>
          <br />
          <PrimaryButton name='Create Listing' onClick={() => createListing()} />
          <br />
          <SecondaryButton name='Back to your listings' onClick={() => navigate('/hosted_listings')} />
        </FormControl>
      </CentredContainer>
    </>
  );
};

export default CreateListing;
