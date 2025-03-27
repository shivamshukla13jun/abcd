import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import { IoIosAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import apiService from '@service/apiService';
import './ItemServicesList.scss';

const schema = yup.object().shape({
  label: yup.string().required('Label is required'),
  value: yup.mixed()
    .test('is-string-or-number', 'Value must be a string or number', value => 
      typeof value === 'string' || typeof value === 'number'
    )
    .required('Value is required')
});

const ItemServicesList = () => {
  const [itemServices, setItemServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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
      label: '',
      value: ''
    }
  });

  const fetchItemServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.getItemServices();
      setItemServices(response.data);
    } catch (error) {
      toast.error('Failed to fetch item services');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemServices();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setValue('label', item.label);
    setValue('value', item.value);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item service?')) {
      try {
        await apiService.deleteItemService(id);
        toast.success('Item service deleted successfully');
        fetchItemServices();
      } catch (error) {
        toast.error('Failed to delete item service');
        console.error('Error:', error);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingItem) {
        await apiService.updateItemService(editingItem._id, data);
        toast.success('Item service updated successfully');
      } else {
        await apiService.createItemService(data);
        toast.success('Item service created successfully');
      }
      setShowModal(false);
      setEditingItem(null);
      reset();
      fetchItemServices();
    } catch (error) {
      toast.error(editingItem ? 'Failed to update item service' : 'Failed to create item service');
      console.error('Error:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
  };

  return (
    <div className="payment-terms">
      <Container>
        <div className="payment-terms__header">
          <h2>Item Services</h2>
          <Button className="payment-terms__create-btn" onClick={() => setShowModal(true)}>
            <IoIosAdd /> Add New Item Service
          </Button>
        </div>

        <div className="payment-terms__table-wrapper">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Label</th>
                <th>Input Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center">Loading...</td></tr>
              ) : itemServices.length === 0 ? (
                <tr><td colSpan="3" className="text-center">No item services found</td></tr>
              ) : (
                itemServices.map((item) => (
                  <tr key={item._id}>
                    <td>{item.label}</td>
                    <td>{item.value}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id)}>
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
            <Modal.Title>{editingItem ? 'Edit' : 'Add New'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Value Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Service Input Type</Form.Label>
                <Form.Select 
                  {...register('value')} 
                  onChange={(e) => setValue('value', e.target.value)}
                >
                  <option value="string">String</option>
                  <option value="number">Integer</option>
                </Form.Select>
              </Form.Group>

              {/* Amount Label Field */}
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control 
                  type="text" 
                  {...register('label')} 
                  isInvalid={!!errors.label} 
                  placeholder="Service Name"
                />
                <Form.Control.Feedback type="invalid">{errors.label?.message}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                <Button variant="primary" type="submit">{editingItem ? 'Update' : 'Create'}</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default ItemServicesList;