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

const EditListing = () => {
  const listingId = window.location.href.split('/')[4];
  const [thumbnailType, setThumbnailType] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/');
    }
    window.scrollTo(0, 0);
    const getListingData = async () =>
      await apiRequest('listings', undefined, 'GET').catch((error) => console.log(error));
    let found = false;
    getListingData().then((json) => {
      json.listings.forEach((listing) => {
        // If the listing exists and the owner of the listing is the current user
        if (listing.id === parseInt(listingId) && listing.owner === localStorage.getItem('email')) {
          found = true;
        }
      });
      if (!found) {
        navigate('/hosted_listings');
      }
    });
  }, []);

  localStorage.setItem('page', 'Edit Listing');
  document.title = 'Edit Listing';

  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('House');
  const [numBaths, setNumBaths] = React.useState('0');
  const [thumbnail, setThumbnail] = React.useState(null);
  const [images, setImages] = React.useState([]);
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

  React.useEffect(() => {
    const getListingData = async () => await apiRequest(`listings/${listingId}`, undefined, 'GET');
    getListingData().then((data) => {
      setTitle(data.listing.title);
      setType(data.listing.metadata.type);
      setNumBaths(data.listing.metadata.bathrooms);
      setAddress(data.listing.address);
      setPrice(data.listing.price);
      setAmenities(data.listing.metadata.amenities);
      document.getElementById('address').value = data.listing.address;
    });
  }, []);

  const changeAmenities = (event) => {
    setAmenities({
      ...amenities,
      [event.target.name]: event.target.checked,
    });
  };

  const updateListing = async () => {
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
    let formatThumbnail = thumbnail;
    if (thumbnail !== null) {
      if (thumbnailType === 'photo') {
        try {
          await fileToDataUrl(thumbnail)
            .then((data) => {
              formatThumbnail = data;
            })
            .catch((error) => {
              document.getElementById('listing-thumbnail').value = '';
              console.log(error);
            });
        } catch (error) {
          document.getElementById('listing-thumbnail').value = '';
          return;
        }
      }
    } else {
      alert("You didn't enter a thumbnail");
      return;
    }
    if (thumbnailType === 'youtube') {
      formatThumbnail = thumbnail.replace('watch?v=', 'embed/')
    }
    const formatImages = [formatThumbnail];
    try {
      for (const image of images) {
        await fileToDataUrl(image)
          .then((data) => {
            formatImages.push(data);
          })
          .catch((error) => {
            document.getElementById('listing-images').value = '';
            console.log(error);
          });
      }
    } catch (error) {
      document.getElementById('listing-images').value = '';
      return;
    }
    const listing = {
      title,
      address,
      price: parseInt(price),
      thumbnail: formatThumbnail,
      metadata: {
        type,
        bedrooms: getRooms(),
        bathrooms: parseInt(numBaths),
        amenities,
        images: formatImages,
      },
    };
    apiRequest(`listings/${listingId}`, listing, 'PUT');
    navigate('/hosted_listings');
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
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
            value={numBaths}
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
            value={price}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
            }}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
          <FormControl>
            <AmenityCheckboxes onChange={changeAmenities} amenities={amenities} />
          </FormControl>
          <TextField
            required
            type='file'
            multiple
            id='listing-images'
            label='Property Images'
            aria-label='Property Images'
            helperText='Hold down the CTRL or SHIFT key to select multiple files'
            inputProps={{ multiple: true }}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setImages(e.target.files);
            }}
          />
          <br />
          <PrimaryButton name='Edit Listing' onClick={() => updateListing()} />
          <br />
          <SecondaryButton name='Back to your listings' onClick={() => navigate('/hosted_listings')} />
        </FormControl>
      </CentredContainer>
    </>
  );
};

export default EditListing;
