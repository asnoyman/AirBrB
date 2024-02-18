import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Site from './page/Site';
import Login from './page/Login';
import Register from './page/Register';
import HostedListings from './page/HostedListingsPage';
import CreateListing from './page/CreateListing';
import EditListing from './page/EditListing';
import ViewListing from './page/ViewListing';
import ViewBookings from './page/ViewBookings';
import ViewReviews from './page/ViewReviews';

const Router = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/hosted_listings' element={<HostedListings />} />
      <Route path='/create_listing' element={<CreateListing />} />
      <Route path='/edit_listing/:listingid' element={<EditListing />} />
      <Route path='/view_listing/:listingid' element={<ViewListing />} />
      <Route path='/view_bookings/:listingid' element={<ViewBookings />} />
      <Route path='/view_reviews/:listingid/:rating' element={<ViewReviews />} />
      <Route path='/' element={<Site />} />
    </Routes>
  );
};

export default Router;
