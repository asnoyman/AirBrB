import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { apiRequest } from '../Api';
import { range } from 'lodash';

const ProfitGraph = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getProfitData();
  }, [])

  const getProfitData = async () => {
    const newData = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const date = new Date(Date.now()).setHours(0, 0, 0, 0);
    const DAY = 1000 * 60 * 60 * 24;
    const listingIds = [];
    await apiRequest('listings', undefined, 'GET')
      .then((data) => {
        for (const listing of data.listings) {
          if (listing.owner === localStorage.getItem('email')) {
            listingIds.push(listing.id);
          }
        }
      })
      .catch((error) => { console.log(error.error) })
    await apiRequest('bookings', undefined, 'GET')
      .then((json) => {
        for (const booking of json.bookings) {
          const costPerDay = getBookingLength(booking);
          if (listingIds.includes(parseInt(booking.listingId)) && booking.status === 'accepted') {
            for (const day of range(booking.dateRange.start, booking.dateRange.end, DAY)) {
              const dayDelta = (date - new Date(day).setHours(0, 0, 0, 0)) / DAY;
              if (dayDelta >= 0 && dayDelta <= 30) {
                newData[dayDelta] += booking.totalPrice / costPerDay;
              }
            }
          }
        }
        const temp = [];
        for (const [day, profit] of newData.entries()) {
          temp.unshift({ day: `${day}`, profit });
        }
        setData(temp);
      })
      .catch((error) => console.log(error.error));
  };

  const getBookingLength = (booking) => {
    return (booking.dateRange.end - booking.dateRange.start) / 86400000;
  };

  return (
    <>
      {data.length !== 0 &&
        <Paper>
          <Chart data={data}>
            <ArgumentAxis />
            <ValueAxis />
            <BarSeries valueField='profit' argumentField='day' />
            <Title text='Profits vs Day' />
            <Animation />
          </Chart>
        </Paper>}
    </>
  );
}

export default ProfitGraph
