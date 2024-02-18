import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import GoLiveModal from './GoLiveModal';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiRequest } from '../Api';
import HoverRating from './HoverRating';
import PrimaryButton from './PrimaryButton';

const HostedListingTable = ({ data }) => {
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]);

  const table = {
    overflowX: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  }

  const thumbnailStyle = {
    maxWidth: '170px',
    maxHeight: '140px',
    objectFit: 'contain',
  }

  React.useEffect(() => {
    data.then((listingData) => {
      setListings(listingData);
    });
  }, []);

  const deleteListing = (id) => {
    apiRequest(`listings/${id}`, undefined, 'DELETE')
      .then(() => {
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewBooking = (id) => {
    apiRequest(`listings/${id}`, undefined, 'GET')
      .then((listing) => {
        if (listing.listing.published) {
          navigate(`/view_bookings/${id}`);
        } else {
          alert("You can't view booking requests for an unpublished listing");
        }
      })
      .catch((error) => {
        console.log(error.error);
      });
  };

  return (
    <div>
      <Paper style={table}>
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
              <TableCell key='edit'></TableCell>
              <TableCell key='Go Live'></TableCell>
              <TableCell key='Delete'></TableCell>
              <TableCell key='Bookings'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.length === 0
              ? (<TableRow>
                <TableCell>No hosted listings</TableCell>
              </TableRow>)
              : listings.map(
                ({
                  id,
                  title,
                  type,
                  beds,
                  baths,
                  thumbnail,
                  svg,
                  ratingSpread,
                  reviews,
                  price,
                }) => (
                  <TableRow key={id}>
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
                    <TableCell key={`edit${id}`}>
                      <PrimaryButton name='Edit' onClick={() => navigate(`/edit_listing/${id}`)} />
                    </TableCell>
                    <TableCell key={`go-live${id}`}>
                      <GoLiveModal id={id} />
                    </TableCell>
                    <TableCell key={`delete${id}`}>
                      <IconButton
                        aria-label='delete'
                        onClick={() => {
                          deleteListing(id);
                        }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell key={`bookings${id}`}>
                      <PrimaryButton name='Booking Requests' onClick={() => viewBooking(id)} />
                    </TableCell>
                  </TableRow>)
              )
            }
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

HostedListingTable.propTypes = {
  data: PropTypes.instanceOf(Promise).isRequired,
};

export default HostedListingTable;
