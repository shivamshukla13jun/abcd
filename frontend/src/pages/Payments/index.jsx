import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Card, Tab, Tabs } from 'react-bootstrap';
import { fetchPayments } from '@redux/Slice/accountingSlice';
import DragDropUpload from '@components/DragDropUpload';
import './Payments.scss';

const Payments = () => {
  const dispatch = useDispatch();
  const { data: payments, loading } = useSelector(state => state.accounting.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleDocumentUpload = (fileData) => {
    // Handle the uploaded document
    console.log('Uploaded document:', fileData);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="payments-page">
      <Card>
        <Card.Header>
          <h2>Payment Management</h2>
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey="history" className="mb-3">
            <Tab eventKey="history" title="Payment History">
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.invoiceNumber}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${payment.status.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>
                        <Button variant="primary" size="sm" className="me-2">
                          View Details
                        </Button>
                        <Button variant="success" size="sm">
                          Process Payment
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="upload" title="Upload Documents">
              <div className="upload-section">
                <h4>Upload Payment Documents</h4>
                <DragDropUpload onUpload={handleDocumentUpload} />
              </div>
            </Tab>
            <Tab eventKey="todo" title="To-Do List">
              <div className="todo-section">
                <h4>Payment Tasks</h4>
                {/* Add your todo list component here */}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payments;
