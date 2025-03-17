import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Badge } from 'react-bootstrap';
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddCustomer from '@components/Customers/AddCustomer';
import EditCustomer from '@components/Customers/EditCustomer';
import apiService from '@service/apiService';
import './ViewCustomers.scss';

const ViewCustomers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentTerms, setPaymentTerms] = useState([]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentTerms = async () => {
    try {
      const response = await apiService.getPaymentTerms();
      setPaymentTerms(response.data);
    } catch (error) {
      console.error('Error fetching payment terms:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchPaymentTerms();
  }, []);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowAddModal(true);
  };

  const handleDeleteClick = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(customerId);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleEditSuccess = () => {
    fetchCustomers();
    setShowEditModal(false);
    setSelectedCustomer(null);
    toast.success('Customer updated successfully');
  };

  const handleAddSuccess = () => {
    fetchCustomers();
    setShowAddModal(false);
    toast.success('Customer added successfully');
  };

  const getRatingBadge = (rating) => {
    const ratingColors = {
      'A': 'success',
      'B': 'info',
      'C': 'warning',
      'D': 'danger',
      'F': 'dark'
    };
    return (
      <Badge bg={ratingColors[rating] || 'secondary'} className="customer-rating">
        {rating}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'active': 'success',
      'inactive': 'danger',
      'pending': 'warning'
    };
    return (
      <Badge bg={statusColors[status] || 'secondary'} className="customer-status">
        {status?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="view-customers">
      <Container fluid className="view-customers__container">
        <div className="view-customers__header">
          <h2>Customers</h2>
          <Button className="view-customers__create-btn" onClick={() => setShowAddModal(true)}>
            <IoIosAdd />
            Add New Customer
          </Button>
        </div>

        <div className="view-customers__table-wrapper">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>MC Number</th>
                <th>USDOT</th>
                <th>Payment Terms</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Rating</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">Loading...</td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map(customer => (
                  <tr key={customer._id}>
                    <td>{customer.customerName}</td>
                    <td>
                      <div>{customer.email}</div>
                      <div>{customer.phone}</div>
                    </td>
                    <td>
                      <div>{customer.address}</div>
                      <div>{`${customer.city}, ${customer.state} ${customer.zipCode}`}</div>
                    </td>
                    <td>{customer.mcNumber}</td>
                    <td>{customer.usdot}</td>
                    <td>
                      <div>{customer?.paymentTerms?.name || 'N/A'} ({customer?.paymentTerms?.days || 'N/A'} days)</div>
                    </td>
                    <td>
                      <div className='text-capitalize'>{customer?.paymentMethod || 'N/A'}</div>
                      {/* <div>{customer?.paymentTerms?.name || 'N/A'} ({customer?.paymentTerms?.days || 'N/A'} days)</div> */}
                    </td>

                    <td>{getStatusBadge(customer.status)}</td>
                    <td>{getRatingBadge(customer.rating)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditClick(customer)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(customer._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No customers found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      <AddCustomer
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCustomer(null);
        }}
        onSuccess={handleAddSuccess}
        initialData={selectedCustomer}
      />

    </div>
  );
};

export default ViewCustomers;
