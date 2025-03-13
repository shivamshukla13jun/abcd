import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './Ratings.scss';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState({
    loadId: '',
    carrierId: '',
    driverId: '',
    rating: 5,
    feedback: ''
  });

  useEffect(() => {
    // Fetch ratings
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/ratings');
        const data = await response.json();
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRating),
      });
      const data = await response.json();
      setRatings([...ratings, data]);
      // Reset form
      setNewRating({
        loadId: '',
        carrierId: '',
        driverId: '',
        rating: 5,
        feedback: ''
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRating(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="ratings-page">
      <Card className="mb-4">
        <Card.Header>
          <h2>Submit New Rating</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Load ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="loadId"
                    value={newRating.loadId}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Carrier ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="carrierId"
                    value={newRating.carrierId}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Driver ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="driverId"
                    value={newRating.driverId}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    value={newRating.rating}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="feedback"
                    rows={3}
                    value={newRating.feedback}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary">Submit Rating</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2>Rating History</h2>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Carrier ID</th>
                <th>Driver ID</th>
                <th>Rating</th>
                <th>Feedback</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating._id}>
                  <td>{rating.loadId}</td>
                  <td>{rating.carrierId}</td>
                  <td>{rating.driverId}</td>
                  <td>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={index < rating.rating ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{rating.feedback}</td>
                  <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Ratings;
