import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { apiRequest } from '../Api';
import AllListingTable from '../components/AllListingTable';
import Header from '../components/Header';

const Site = () => {
  const [showSpinner, setShowSpinner] = React.useState(true)
  localStorage.setItem('page', 'AirBrB');
  document.title = 'AirBrB';
  localStorage.removeItem('dateRangeStart')
  localStorage.removeItem('dateRangeEnd')

  const listingData = [];
  const getRows = async () => {
    const json = await apiRequest('listings', undefined, 'GET').catch((error) =>
      console.log(error)
    );
    const promises = [];
    const ids = [];
    await json.listings.forEach((listing) => {
      promises.push(apiRequest(`listings/${listing.id}`, undefined, 'GET'));
      ids.push(listing.id);
    });
    await Promise.all(promises).then((listings) => {
      for (const [i, listing] of listings.entries()) {
        if (listing.listing.published) {
          const bedrooms = listing.listing.metadata.bedrooms;
          let numBeds = 0;
          for (const room of bedrooms) {
            for (const [, amount] of Object.entries(room)) {
              numBeds += amount;
            }
          }
          let ratingSum = 0;
          for (const review of listing.listing.reviews) {
            ratingSum += review.rating
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
            address: listing.listing.address,
            availability: listing.listing.availability,
          });
        }
      }
    });
    setShowSpinner(false)
    return listingData;
  };

  return (
    <>
      <Header />
      {showSpinner && <LinearProgress id='loading-bar' />}
      <br />
      <AllListingTable data={getRows()}></AllListingTable>
    </>
  );
};

export default Site;
