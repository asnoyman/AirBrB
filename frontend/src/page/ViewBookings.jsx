import * as React from 'react';
import Header from '../components/Header';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../Api';
import { Button, ButtonGroup, LinearProgress } from '@material-ui/core';
import CentredContainer from '../components/CentredContainer';

const ViewBookings = () => {
  const navigate = useNavigate();
  const listingId = window.location.href.split('/')[4];
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [listingData, setListingData] = React.useState({});
  const [bookings, setBookings] = React.useState([]);

  localStorage.setItem('page', 'View Bookings');
  document.title = 'View Bookings';

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/');
    }
    window.scrollTo(0, 0);
    const getListingData = async () =>
      await apiRequest(`listings/${listingId}`, undefined, 'GET').catch((error) =>
        console.log(error)
      );
    getListingData().then((json) => {
      // If the listing exists and the owner of the listing is the current user
      if (json.listing.owner !== localStorage.getItem('email')) {
        navigate('/hosted_listings');
      }
      setListingData(json.listing);
    });
    const getBookings = async () =>
      await apiRequest('bookings', undefined, 'GET').catch((error) => console.log(error));
    getBookings().then((json) => {
      for (const booking of json.bookings) {
        if (booking.listingId === listingId) {
          setBookings((prev) => prev.concat(booking));
        }
      }
      setShowSpinner(false);
    });
  }, []);

  const getTimeLive = () => {
    const datePosted = listingData.postedOn;
    const timeElapsed = Date.now() - Date.parse(datePosted);
    if (timeElapsed / (1000 * 60) < 1) {
      return <>{Math.round(timeElapsed / 1000)} seconds</>;
    }
    if (timeElapsed / (1000 * 60 * 60) < 1) {
      return <>{Math.round(timeElapsed / (1000 * 60))} minutes</>;
    }
    if (timeElapsed / (1000 * 60 * 60 * 24) < 1) {
      return <>{Math.round(timeElapsed / (1000 * 60 * 60))} hours</>;
    }
    if (timeElapsed / (1000 * 60 * 60 * 24 * 30) < 1) {
      return <>{Math.round(timeElapsed / (1000 * 60 * 60 * 24))} days</>;
    }
    return <>{Math.round(timeElapsed / (1000 * 60 * 60 * 24 * 30))} months</>;
  };

  const showBookingHistory = () => {
    if (bookings.length === 0) return <>No Bookings</>;

    return (
      <div style={{ textAlign: 'center' }} key='bookings'>
        <br />
        {bookings.map((booking, i) => (
          <div key={`container${i}`}>
            <div key={i}>
              Booking {i + 1}: from{' '}
              {new Date(booking.dateRange.start).toLocaleDateString('en-AU')} to {' '}
              {new Date(booking.dateRange.end).toLocaleDateString('en-AU')} - status: {booking.status}
              {booking.status === 'pending' && (
                <ButtonGroup variant='contained' color='primary' aria-label='Accept or Deny Booking Request Button Group'>
                  <Button aria-label='Accept' onClick={() => apiRequest(`bookings/accept/${booking.id}`, {}, 'PUT')
                    .then(() => { navigate(0); })
                    .catch((err) => console.log(err))}>Accept</Button>
                  <Button color='secondary' aria-label='Deny' onClick={() => apiRequest(`bookings/decline/${booking.id}`, {}, 'PUT')
                    .then(() => { navigate(0); })
                    .catch((err) => console.log(err))}>Deny</Button>
                </ButtonGroup>
              )}
            </div>
            <br />
          </div>
        ))}
      </div>
    );
  };

  // TODO: Test this
  const getDaysBooked = () => {
    let days = 0
    for (const booking of bookings) {
      const start = booking.dateRange.start
      const startYear = new Date(start).getFullYear()
      const currYear = new Date(Date.now()).getFullYear()
      if (booking.status === 'accepted' && startYear === currYear) {
        days += (booking.dateRange.end - booking.dateRange.start) / (1000 * 60 * 60 * 24)
      }
    }
    return <>{days}</>
  }

  const getProfit = () => {
    let profit = 0
    for (const booking of bookings) {
      const start = booking.dateRange.start
      const startYear = new Date(start).getFullYear()
      const currYear = new Date(Date.now()).getFullYear()
      if (booking.status === 'accepted' && startYear === currYear) {
        profit += booking.totalPrice
      }
    }
    return <>{profit}</>
  }

  return (
    <>
      <Header />
      {showSpinner && <LinearProgress id="loading-bar" />}
      <CentredContainer>
        <div>Time live: {getTimeLive()}</div>
        <div>Booking history:</div>
        {showBookingHistory()}
        <div>Days booked this year: {getDaysBooked()}</div>
        <div>Profit this year: ${getProfit()}</div>
      </CentredContainer>
    </>
  );
};

export default ViewBookings;
