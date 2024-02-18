import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import HostedListingTable from '../components/HostedListingTable';
import { apiRequest } from '../Api';
import { Button, LinearProgress } from '@material-ui/core';
import ProfitGraph from '../components/ProfitGraph';
import CreateListingJSONModal from '../components/CreateListingJSONModal';

const HostedListingsPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/');
    }
    window.scrollTo(0, 0)
  }, []);

  const [showSpinner, setShowSpinner] = React.useState(true);

  localStorage.setItem('page', 'Hosted Listings');
  document.title = 'Hosted Listings';

  const listingData = [];
  const getRows = async () => {
    const json = await apiRequest('listings', undefined, 'GET').catch((error) =>
      console.log(error)
    );
    const promises = [];
    const ids = [];
    await json.listings.forEach((listing) => {
      if (listing.owner === localStorage.getItem('email')) {
        promises.push(apiRequest(`listings/${listing.id}`, undefined, 'GET'));
        ids.push(listing.id);
      }
    });
    await Promise.all(promises).then((listings) => {
      for (const [i, listing] of listings.entries()) {
        const bedrooms = listing.listing.metadata.bedrooms;
        let numBeds = 0;
        for (const room of bedrooms) {
          for (const [, amount] of Object.entries(room)) {
            numBeds += amount;
          }
        }
        let ratingSum = 0;
        for (const review of listing.listing.reviews) {
          ratingSum += review.rating;
        }
        const ratingNum = listing.listing.reviews.length;
        let overallRating = 0;
        if (ratingNum !== 0) {
          overallRating = ratingSum / ratingNum;
        }

        const ratingSpread = [0, 0, 0, 0, 0, 0]
        for (const review of listing.listing.reviews) {
          ratingSpread[review.rating - 1] += 1
          ratingSpread[5] += 1
        }

        listingData.push({
          id: ids[i],
          title: listing.listing.title,
          type: listing.listing.metadata.type,
          beds: numBeds,
          baths: listing.listing.metadata.bathrooms,
          thumbnail: listing.listing.thumbnail,
          svg: overallRating,
          ratingSpread,
          reviews: ratingNum,
          price: listing.listing.price,
        });
      }
    });
    setShowSpinner(false);
    return listingData;
  };

  return (
    <>
      <Header />
      {showSpinner && <LinearProgress id='loading-bar' />}
      <br />
      <Button
        aria-label='Create New Listing (Form)'
        id='create-listing-button'
        variant='contained'
        color='primary'
        onClick={() => navigate('/create_listing')}
        style={{ margin: '10px' }}>
        Create New Listing (Form)
      </Button>
      <CreateListingJSONModal />
      <HostedListingTable data={getRows()}></HostedListingTable>
      <ProfitGraph />
    </>
  );
};

export default HostedListingsPage;
