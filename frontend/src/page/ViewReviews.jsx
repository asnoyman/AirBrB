import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../Api';
import { AppBar, Button, Toolbar } from '@mui/material';

const ViewReviews = () => {
  const listingId = window.location.href.split('/')[4];
  const rating = parseFloat(window.location.href.split('/')[5]);
  const [reviews, setReviews] = React.useState([]);
  const navigate = useNavigate();
  document.title = 'View Reviews';

  React.useEffect(async () => {
    if (![1, 2, 3, 4, 5].includes(rating)) {
      navigate('/');
    }
    let found = false;
    await apiRequest('listings', undefined, 'GET')
      .then((json) => {
        for (const listing of json.listings) {
          if (listing.id === parseInt(listingId)) {
            found = true;
          }
        }
        if (!found) {
          navigate('/');
        }
      })
      .catch((error) => { console.log(error.error) })

    found && apiRequest(`listings/${listingId}`, undefined, 'GET')
      .then((listing) => {
        if (localStorage.getItem('email') !== listing.listing.owner && !listing.listing.published) {
          navigate('/');
        }
        for (const review of listing.listing.reviews) {
          if (review.rating === rating) {
            setReviews((prev) => prev.concat(review));
          }
        }
      })
      .catch((error) => { console.log(error.error) });
  }, [])

  const showReviews = () => {
    return (
      <div>
        {reviews.length === 0
          ? 'No Reviews'
          : reviews.map((review, i) => (
            <div key={i}>
              Review {i + 1}: {review.comment === '' ? 'No Comment' : `"${review.comment}"`}
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <AppBar
        position='fixed'
        style={{ backgroundColor: '#1976d2', color: '#fff' }}
        sx={{
          left: 0,
          minWidth: '400px',
          height: '60px',
        }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            aria-label='Close'
            color='inherit'
            style={{ fontSize: '12pt' }}
            onClick={() => {
              navigate(-1);
            }}>
            X
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ margin: '80px 0px 0px 40px' }}>
        <div>{rating} Star Reviews:</div>
        <br />
        {showReviews()}
      </div>
    </>
  );
};

export default ViewReviews;
