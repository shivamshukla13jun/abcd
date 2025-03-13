import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiService from '@service/apiService';
import './AddCustomer.scss';
import { toast } from 'react-toastify';
import { initialCustomerData } from '@/data/customerData';

const schema = yup.object().shape({
  customerName: yup.string().required('Company name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  mcNumber: yup.string().required('MC Number is required'),
  usdot: yup.string().required('USDOT Number is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  paymentTerms: yup.string().required('Payment term is required'),
  vatNumber: yup.string().required('VAT Registration Number is required'),
  utrNumber: yup.string().required('UTR number is required'),
});

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'bank transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' }
];

const EditCustomer = ({ show, onHide, onSuccess, customer }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [paymentTerms, setPaymentTerms] = useState([]);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialCustomerData
  });

  useEffect(() => {
    const fetchPaymentTerms = async () => {
      try {
        const response = await apiService.getPaymentTerms();
        setPaymentTerms(response.data);
      } catch (error) {
        console.error('Error fetching payment terms:', error);
        toast.error('Failed to fetch payment terms');
      }
    };

    fetchPaymentTerms();
  }, []);

  useEffect(() => {
    if (customer) {
      reset(customer)
    }
  }, [customer,]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await apiService.updateCustomer(customer._id, data);
      onSuccess();
      onHide();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="add-customer-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="section">
            <h6>Name and Contact</h6>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('customerName')}
                    isInvalid={!!errors.customerName}
                    placeholder="Enter company name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customerName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email')}
                    isInvalid={!!errors.email}
                    placeholder="Enter email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('phone')}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('address')}
                    isInvalid={!!errors.address}
                    placeholder="Enter address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('city')}
                    isInvalid={!!errors.city}
                    placeholder="Enter city"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('state')}
                    isInvalid={!!errors.state}
                    placeholder="Enter state"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('zipCode')}
                    isInvalid={!!errors.zipCode}
                    placeholder="Enter zip code"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zipCode?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>MC Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('mcNumber')}
                    isInvalid={!!errors.mcNumber}
                    placeholder="Enter MC Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mcNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>USDOT Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('usdot')}
                    isInvalid={!!errors.usdot}
                    placeholder="Enter USDOT Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.usdot?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    {...register('paymentMethod')}
                    isInvalid={!!errors.paymentMethod}
                  >
                    <option value="">Select Payment Method</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.paymentMethod?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Terms</Form.Label>
                  <Form.Select
                    {...register('paymentTerms')}
                    isInvalid={!!errors.paymentTerms}
                  >
                    <option value="">Select Payment Terms</option>
                    {paymentTerms.map((term) => (
                      <option key={term._id} value={term._id}>
                        {term.name} ({term.days} days)
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.paymentTerms?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>VAT Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('vatNumber')}
                    isInvalid={!!errors.vatNumber}
                    placeholder="Enter VAT Registration Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vatNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>UTR Number</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('utrNumber')}
                    isInvalid={!!errors.utrNumber}
                    placeholder="Enter UTR Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.utrNumber?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
          <Button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCustomer;
