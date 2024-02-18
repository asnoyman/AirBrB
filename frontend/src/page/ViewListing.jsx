import * as React from 'react';
import Header from '../components/Header';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../Api';
import { LinearProgress } from '@material-ui/core';
import MakeBookingModal from '../components/MakeBookingModal';
import LeaveReviewModal from '../components/LeaveReviewModal';
import HoverRating from '../components/HoverRating';
import CentredContainer from '../components/CentredContainer';
import Carousel from '../components/Carousel';

const ViewListing = () => {
  const [listingInfo, setListingInfo] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [bookingsList, setBookingsList] = React.useState([]);
  const [owner, setOwner] = React.useState(false);
  const listingId = window.location.href.split('/')[4];
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setLoggedIn(true);
    }
    const getListingData = async () =>
      await apiRequest('listings', undefined, 'GET').catch((error) => console.log(error));
    let found = false;
    getListingData().then(async (json) => {
      json.listings.forEach((listing) => {
        // Check the listing exists
        if (listing.id === parseInt(listingId)) {
          found = true;
        }
      });
      if (!found) {
        navigate('/');
        return;
      }
      // If the listing exists check that it is also published
      await apiRequest(`listings/${listingId}`, undefined, 'GET')
        .then((data) => {
          if (!data.listing.published) {
            navigate('/');
            return;
          }
          setListingInfo(data.listing);
          showBookings();
          setShowSpinner(false);
        })
        .catch((error) => console.log(error));
    });
  }, []);

  localStorage.setItem('page', 'View Listing');
  document.title = 'View Listing';
  const dateRangeStart = localStorage.getItem('dateRangeStart');
  const dateRangeEnd = localStorage.getItem('dateRangeEnd');
  const dateRangeUsed = dateRangeStart !== null && dateRangeEnd !== null;

  const getAmenities = () => {
    const amenities = [];
    if (listingInfo.length !== 0) {
      for (const [amenity, value] of Object.entries(listingInfo.metadata.amenities)) {
        if (value) {
          amenities.push(amenity);
        }
      }
    }
    if (amenities.length === 0) {
      return <>No amenities available</>;
    }

    return (
      <>
        {amenities.join(', ')}
      </>
    );
  };

  const getNumBeds = (bedrooms) => {
    let tally = 0;
    for (const bedroom of bedrooms) {
      for (const [, value] of Object.entries(bedroom)) {
        tally += value;
      }
    }
    return tally;
  };

  const displayImages = () => {
    const images = [];
    for (const image of listingInfo.metadata.images) {
      images.push({ img: image });
    }

    return <Carousel images={images} title={listingInfo.title} />
  };

  const showBookings = async () => {
    const bookings = [];
    await apiRequest('bookings', undefined, 'GET')
      .then((json) => {
        for (const booking of json.bookings) {
          if (booking.listingId === listingId && booking.owner === localStorage.getItem('email')) {
            bookings.push(booking);
          }
        }
        setBookingsList(bookings);
      })
      .catch((err) => console.log(err));
  };

  const listBookings = () => {
    if (bookingsList.length === 0) {
      return <>You have no bookings for this listing.</>;
    }
    const listOfBookings = [];
    for (let i = 0; i < bookingsList.length; i++) {
      listOfBookings.push(generateBooking(i, bookingsList[i]));
    }
    return listOfBookings;
  };

  const generateBooking = (bookingNum, booking) => {
    const from = new Date(booking.dateRange.start).toLocaleDateString('en-AU');
    const to = new Date(booking.dateRange.end).toLocaleDateString('en-AU');
    return (
      <div key={bookingNum}>
        {`Booking ${bookingNum + 1}: from ${from} to ${to} - status: ${booking.status}`}
      </div>
    );
  };

  const acceptedBooking = () => {
    for (const booking of bookingsList) {
      if (booking.status === 'accepted') {
        return booking.id;
      }
    }
    return false;
  };

  const ratingSpread = [0, 0, 0, 0, 0, 0];
  const getAverageRating = () => {
    if (listingInfo.reviews.length === 0) {
      return 0;
    }

    let total = 0;
    for (const review of listingInfo.reviews) {
      total += review.rating;
    }

    for (const review of listingInfo.reviews) {
      ratingSpread[review.rating - 1] += 1;
      ratingSpread[5] += 1;
    }

    return total / listingInfo.reviews.length;
  };

  const loadReviews = () => {
    if (listingInfo.reviews.length === 0) {
      return <>No Reviews</>;
    }
    return (
      <>
        {listingInfo.reviews.map((review, i) => (
          <div key={i}>
            Review {i + 1}: {review.rating}/5, Comment:{' '}
            {review.comment === '' ? 'No Comment' : `"${review.comment}"`}
          </div>
        ))}
      </>
    );
  };

  React.useEffect(() => {
    apiRequest(`listings/${window.location.href.split('/')[4]}`, undefined, 'GET')
      .then((json) => {
        setOwner(json.listing.owner === localStorage.getItem('email'));
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error.error)
      })
  }, [])

  return (
    <>
      <Header />
      {showSpinner && <LinearProgress id='loading-bar' />}
      <CentredContainer>
        {listingInfo.length !== 0 && (<>
          <div style={{ textAlign: 'center' }}>{listingInfo.title}</div>
          <br />
          <div>Address: {listingInfo.address}</div>
          <div>Amenities: {getAmenities()}</div>
          {dateRangeUsed
            ? (<div>
              Price per stay: $
              {listingInfo.price * ((dateRangeEnd - dateRangeStart) / (1000 * 60 * 60 * 24))}
            </div>)
            : <div>Price per night: ${listingInfo.price}</div>}
          <div>Type: {listingInfo.metadata.type}</div>
          <div>Listing Images: {displayImages()}</div>
          <div>Number of Reviews: {listingInfo.reviews.length}</div>
          <div style={{ maxHeight: '20vh', overflowY: 'scroll' }}>Reviews: {loadReviews()}</div>
          <div>
            Average Rating:
            <span>
              <HoverRating id={listingId} svg={getAverageRating()} ratingSpread={ratingSpread} />
            </span>
          </div>
          <div>Number of Bedrooms: {listingInfo.metadata.bedrooms.length}</div>
          <div>Number of Beds: {getNumBeds(listingInfo.metadata.bedrooms)}</div>
          <div>Number of Bathrooms: {listingInfo.metadata.bathrooms}</div>
          <br />
          {(!owner && loggedIn) && <>
            <div>Status of Booking(s): {listBookings()}</div>
            <br />
            <MakeBookingModal
              availabilities={listingInfo.availability}
              price={parseInt(listingInfo.price)} />
          </>}
          {(!owner && loggedIn && acceptedBooking()) && (<>
            <br />
            <LeaveReviewModal bookingId={acceptedBooking()} />
          </>)}
        </>)}
      </CentredContainer>
    </>
  );
};

export default ViewListing;
