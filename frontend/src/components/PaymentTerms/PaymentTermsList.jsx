import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import apiService from '@service/apiService';
import './PaymentTermsList.scss';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  days: yup.number()
    .required('Days is required')
    .min(0, 'Days must be at least 0')
    .max(90, 'Days cannot exceed 90'),
  description: yup.string(),
  isActive: yup.boolean()
});

const PaymentTermsList = () => {
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      days: '',
      description: '',
      isActive: true
    }
  });

  const fetchPaymentTerms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPaymentTerms();
      setPaymentTerms(response.data);
    } catch (error) {
      toast.error('Failed to fetch payment terms');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const handleEdit = (term) => {
    setEditingTerm(term);
    setValue('name', term.name);
    setValue('days', term.days);
    setValue('description', term.description);
    setValue('isActive', term.isActive);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment term?')) {
      try {
        await apiService.deletePaymentTerm(id);
        toast.success('Payment term deleted successfully');
        fetchPaymentTerms();
      } catch (error) {
        toast.error('Failed to delete payment term');
        console.error('Error:', error);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingTerm) {
        await apiService.updatePaymentTerm(editingTerm._id, data);
        toast.success('Payment term updated successfully');
      } else {
        await apiService.createPaymentTerm(data);
        toast.success('Payment term created successfully');
      }
      setShowModal(false);
      setEditingTerm(null);
      reset();
      fetchPaymentTerms();
    } catch (error) {
      toast.error(editingTerm ? 'Failed to update payment term' : 'Failed to create payment term');
      console.error('Error:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTerm(null);
    reset();
  };

  return (
    <div className="payment-terms">
      <Container>
        <div className="payment-terms__header">
          <h2>Payment Terms</h2>
          <Button 
            className="payment-terms__create-btn" 
            onClick={() => setShowModal(true)}
          >
            <IoIosAdd /> Add New Payment Term
          </Button>
        </div>

        <div className="payment-terms__table-wrapper">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Days</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">Loading...</td>
                </tr>
              ) : paymentTerms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No payment terms found</td>
                </tr>
              ) : (
                paymentTerms.map((term) => (
                  <tr key={term._id}>
                    <td>{term.name}</td>
                    <td>{term.days}</td>
                    <td>{term.description}</td>
                    <td>
                      <span className={`status-badge ${term.isActive ? 'active' : 'inactive'}`}>
                        {term.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(term)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(term._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingTerm ? 'Edit Payment Term' : 'Add New Payment Term'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register('name')}
                  isInvalid={!!errors.name}
                  placeholder="e.g., Net 30"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Days</Form.Label>
                <Form.Control
                  type="number"
                  {...register('days')}
                  isInvalid={!!errors.days}
                  placeholder="e.g., 30"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.days?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('description')}
                  isInvalid={!!errors.description}
                  placeholder="Enter description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  {...register('isActive')}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingTerm ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default PaymentTermsList; 