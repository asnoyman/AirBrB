import React from 'react';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import '../App.css';
import { apiRequest } from '../Api';
import SearchBar from 'material-ui-search-bar';
import HoverRating from './HoverRating';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import FilterSlider from './FilterSlider';

const AllListingTable = ({ data }) => {
  const [searched, setSearched] = React.useState('');
  const [listings, setListings] = React.useState([]);
  const [fullListings, setFullListings] = React.useState([]);
  const [searchedListings, setSearchedListings] = React.useState([]);
  const [numBedsFilter, setNumBedsFilter] = React.useState([0, 8]);
  const [priceFilter, setPriceFilter] = React.useState([0, 1300]);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [filter, setFilter] = React.useState(
    {
      'Number of Bedrooms': false,
      'Date Range': false,
      Price: false,
      'Order Review Ratings': false,
    });
  const [reviewSort, setReviewSort] = React.useState('Increasing');
  const [showSpinner, setShowSpinner] = React.useState(true);

  const navigate = useNavigate();

  const table = {
    overflowX: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  }

  const filterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const thumbnailStyle = {
    maxWidth: '170px',
    maxHeight: '140px',
    objectFit: 'contain',
  }

  const bedsFilter = (_event, newValue) => {
    setNumBedsFilter(newValue);
  };

  const priceUpdate = (_event, newValue) => {
    setPriceFilter(newValue);
  };

  const handleReviewSort = (event) => {
    setReviewSort(event.target.value)
  }

  const handleChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.checked,
    });
  };

  const unwrapData = () => {
    setShowSpinner(false);
    data.then((listingData) => {
      const listingsCopy = [];
      if (listingData.length !== 0) {
        listingData.sort((a, b) => a.title.localeCompare(b.title))
        if (localStorage.getItem('token') !== null) {
          const bookings = [];
          apiRequest('bookings', undefined, 'GET')
            .then((bookingsList) => {
              for (const booking of bookingsList.bookings) {
                if (booking.owner === localStorage.getItem('email') &&
                  (booking.status === 'accepted' || booking.status === 'pending')) {
                  bookings.push(parseInt(booking.listingId));
                }
              }
              for (const listing of listingData) {
                if (bookings.includes(listing.id)) {
                  listingsCopy.push(listing);
                }
              }
              for (const listing of listingData) {
                if (!bookings.includes(listing.id)) {
                  listingsCopy.push(listing);
                }
              }
              setListings(listingsCopy);
              setFullListings(listingsCopy);
              setSearchedListings(listingsCopy);
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          setListings(listingData);
          setFullListings(listingData);
          setSearchedListings(listingData);
        }
      }
    })
  };

  const requestSearch = (search) => {
    setShowSpinner(true);
    if (search === '') {
      setListings(fullListings);
      setSearchedListings(fullListings);
    } else {
      const filteredListings = fullListings.filter((listing) => {
        return (listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.address.toLowerCase().includes(search.toLowerCase()));
      });
      setListings(filteredListings);
      setSearchedListings(filteredListings);
    }
    setShowSpinner(false);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
    setSearchedListings(fullListings);
  };

  const applyFilter = () => {
    setShowSpinner(true);
    let arrayToFilter = _.cloneDeep(searchedListings);
    if (filter['Number of Bedrooms']) {
      let upperBound = Number.MAX_VALUE;
      if (numBedsFilter[1] !== 8) {
        upperBound = numBedsFilter[1];
      }
      arrayToFilter = searchedListings.filter((listing) => {
        return (listing.beds >= numBedsFilter[0] && listing.beds <= upperBound);
      });
    }
    if (filter['Date Range']) {
      if (startDate === null || isNaN(startDate)) {
        alert("You didn't enter a start date");
        setShowSpinner(false);
        return;
      }
      if (endDate === null || isNaN(endDate)) {
        alert("You didn't enter an end date");
        setShowSpinner(false);
        return;
      }
      if (endDate <= startDate) {
        alert('The end date needs to occur after the start date');
        setShowSpinner(false);
        return;
      }
      if (startDate - new Date(Date.now()).setHours(0, 0, 0, 0) < 0) {
        alert('Start date must be today or later');
        return;
      }
      const validDates = [];
      for (const listing of arrayToFilter) {
        let added = false;
        for (const availability of listing.availability) {
          if (!added && startDate >= availability.start && endDate <= availability.end) {
            validDates.push(listing)
            added = true;
          }
        }
      }
      localStorage.setItem('dateRangeStart', startDate)
      localStorage.setItem('dateRangeEnd', endDate)
      arrayToFilter = _.cloneDeep(validDates);
    }
    if (filter.Price) {
      let upperBound = Number.MAX_VALUE;
      if (priceFilter[1] !== 1300) {
        upperBound = priceFilter[1];
      }
      arrayToFilter = arrayToFilter.filter((listing) => {
        return (listing.price >= priceFilter[0] && listing.price <= upperBound);
      });
    }
    if (filter['Order Review Ratings']) {
      const arrayToSort = _.cloneDeep(arrayToFilter);
      if (reviewSort === 'Increasing') {
        arrayToSort.sort((a, b) => { return a.svg - b.svg })
      } else {
        arrayToSort.sort((a, b) => { return b.svg - a.svg })
      }
      arrayToFilter = _.cloneDeep(arrayToSort);
    }
    setListings(arrayToFilter);
    setShowSpinner(false);
  }

  const clearFilter = () => {
    setShowSpinner(true);
    setListings(searchedListings);
    setNumBedsFilter([0, 8]);
    setPriceFilter([0, 1300]);
    setStartDate(null);
    setEndDate(null);
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = ''
    setReviewSort('Increasing');
    setShowSpinner(false);
    setFilter(
      {
        'Number of Bedrooms': false,
        'Date Range': false,
        Price: false,
        'Order Review Ratings': false,
      });
    localStorage.removeItem('dateRangeStart')
    localStorage.removeItem('dateRangeEnd')
  }

  React.useEffect(() => {
    unwrapData();
  }, []);

  // TODO modularise more
  return (
    <div>
      <Paper style={table}>
        {showSpinner && <LinearProgress id='loading-bar' />}
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-content"
            id="panel-header"
          >
            <Typography>Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl style={{ width: '100%' }}>
              <FormLabel id="filter-options">Select a filter:</FormLabel>
              <FormGroup
                aria-labelledby="filter-options"
                defaultValue="Number of Bedrooms"
                name="checkbox-buttons-group"
              >
                <div style={filterStyle}>
                  <FormControlLabel
                    value="Number of Bedrooms"
                    name="Number of Bedrooms"
                    control={<Checkbox onChange={handleChange}
                      checked={filter['Number of Bedrooms']} />}
                    label="Number of Bedrooms"
                    style={{ width: '40%' }} />
                  <FilterSlider setValue={numBedsFilter} onChange={bedsFilter} min={0} max={8} marks={true} />
                </div>
                <div style={filterStyle}>
                  <FormControlLabel
                    value="Date Range"
                    name="Date Range"
                    control={<Checkbox onChange={handleChange}
                      checked={filter['Date Range']} />}
                    label="Date Range" />
                  <div>
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
                  </div>
                </div>
                <div style={filterStyle}>
                  <FormControlLabel
                    value="Price"
                    name="Price"
                    control={<Checkbox onChange={handleChange}
                      checked={filter.Price} />}
                    label="Price"
                    style={{ width: '40%' }} />
                  <FilterSlider setValue={priceFilter} onChange={priceUpdate} min={0} max={1300} marks={false} />
                </div>
                <div style={filterStyle}>
                  <FormControlLabel
                    value="Order Review Ratings"
                    name="Order Review Ratings"
                    control={<Checkbox onChange={handleChange}
                      checked={filter['Order Review Ratings']} />}
                    label="Order Review Ratings"
                    style={{ width: '40%' }} />
                  <RadioGroup
                    aria-labelledby="review-sort-options"
                    defaultValue="Increasing"
                    name="radio-buttons-group-sort"
                    id="review-filter"
                    value={reviewSort}
                    onChange={handleReviewSort}
                    row
                  >
                    <FormControlLabel value="Increasing" control={<Radio />} label="Increasing" />
                    <FormControlLabel value="Decreasing" control={<Radio />} label="Decreasing" />
                  </RadioGroup>
                </div>
              </FormGroup>
              <div>
                <PrimaryButton name='Apply Filters' onClick={() => applyFilter()} />
                <SecondaryButton name='Clear Filters' onClick={() => clearFilter()} />
              </div>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='title'>Title</TableCell>
              <TableCell key='type'>Property Type</TableCell>
              <TableCell key='beds' numeric='true'>
                # Beds
              </TableCell>
              <TableCell key='baths' numeric='true'>
                # Bathrooms
              </TableCell>
              <TableCell key='thumbnail'>Thumbnail</TableCell>
              <TableCell key='svg' numeric='true'>
                Rating
              </TableCell>
              <TableCell key='reviews' numeric='true'>
                # Reviews
              </TableCell>
              <TableCell key='price' numeric='true'>
                Price / Night ($AUD)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.length === 0
              ? <TableRow><TableCell>No published listings</TableCell></TableRow>
              : listings.map(({ id, title, type, beds, baths, thumbnail, svg, ratingSpread, reviews, price }) => (
                <TableRow key={id} onClick={() => {
                  if (parseInt(localStorage.getItem('hoverOpen')) === -1 || localStorage.getItem('hoverOpen') === null) {
                    navigate(`/view_listing/${id}`);
                  }
                }}
                  hover={true}
                  style={{ cursor: 'pointer' }}>
                  <TableCell key={`title${id}`}>{title}</TableCell>
                  <TableCell key={`type${id}`}>{type}</TableCell>
                  <TableCell key={`beds${id}`} numeric='true'>
                    {beds}
                  </TableCell>
                  <TableCell key={`baths${id}`} numeric='true'>
                    {baths}
                  </TableCell>
                  <TableCell key={`thumbnail${id}`}>
                    {!thumbnail.includes('www.youtube.com')
                      ? <img
                        src={thumbnail}
                        alt={`thumbnail of property ${title}`}
                        style={thumbnailStyle}
                      />
                      : <iframe
                        id="video"
                        width="170"
                        height="140"
                        src={thumbnail}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />}
                  </TableCell>
                  <TableCell
                    key={`svg${id}`}
                    aria-haspopup="true">
                    <HoverRating id={id} svg={svg} ratingSpread={ratingSpread} />
                  </TableCell>
                  <TableCell key={`review${id}`} numeric='true'>
                    {reviews}
                  </TableCell>
                  <TableCell key={`price${id}`} numeric='true'>
                    {price}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </div >
  );
};

AllListingTable.propTypes = {
  data: PropTypes.instanceOf(Promise).isRequired,
};

export default AllListingTable;
