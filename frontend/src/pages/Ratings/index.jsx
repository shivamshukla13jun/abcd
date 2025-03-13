import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/ratings');
        setRatings(response.data.data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4">Ratings</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Load ID</TableCell>
            <TableCell>Carrier ID</TableCell>
            <TableCell>Driver ID</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Feedback</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ratings.map((rating) => (
            <TableRow key={rating._id}>
              <TableCell>{rating.loadId}</TableCell>
              <TableCell>{rating.carrierId}</TableCell>
              <TableCell>{rating.driverId}</TableCell>
              <TableCell>{rating.rating}</TableCell>
              <TableCell>{rating.feedback}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Ratings;
