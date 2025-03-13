import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { FaTrash, FaPlus, FaPrint } from 'react-icons/fa';
import apiService from '@/service/apiService';
import './InvoiceForm.scss';
import { initialinvoiceData } from '@/redux/InitialData/invoice';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import CustomDatePicker from '@/components/common/CommonDatePicker';
import { useDropzone } from 'react-dropzone';

const invoiceSchema = yup.object().shape({
  invoiceNumber: yup.string().required('Load number is required'),
  invoiceDate: yup.date().required('Invoice date is required'),
  dueDate: yup.date().required('Due date is required'),
  location: yup.string().required('Location is required'),
  terms: yup.string().required('Terms are required'),
  customerName: yup.string().required('Customer name is required'),
  customerEmail: yup.string().email('Invalid email').required('Customer email is required'),
  customerAddress: yup.string().required('Customer address is required'),
  items: yup.array().of(
    yup.object().shape({
      itemDetails: yup.string().required('Item details are required'),
      description: yup.string(),
      qty: yup.number().required('Quantity is required').min(0),
      rate: yup.number().required('Rate is required').min(0),
      discount: yup.number().min(0),
      tax: yup.number().min(0).max(100), // Tax as number
      amount: yup.number().min(0)
    })
  ),
  customerNotes: yup.string(),
  terms_conditions: yup.string(),
  discountPercent: yup.number().min(0).max(100),
  deposit: yup.number().min(0)
});

const TAX_OPTIONS = [
  { id: 1, name: 'GST', rate: 5 },
  { id: 2, name: 'VAT', rate: 12.5 },
  { id: 3, name: 'Sales Tax', rate: 8 },
];

const InvoiceForm = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadDetails, setLoadDetails] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    setValue, 
    control, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: initialinvoiceData
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 20971520,
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  });

  useEffect(() => {
    return () => attachments.forEach(file => URL.revokeObjectURL(file.preview));
  }, [attachments]);

  const calculateItemAmount = useCallback((item) => {
    if (!item) return 0;
    const baseAmount = (item.qty || 0) * (item.rate || 0);
    const taxAmount = (baseAmount * (item.tax || 0)) / 100;
    const discountAmount = item.discount || 0;
    return Number((baseAmount + taxAmount - discountAmount).toFixed(2));
  }, []);

  const itemAmounts = useMemo(() => {
    return fields.map((field, index) => {
      const item = watch(`items.${index}`);
      return calculateItemAmount(item);
    });
  }, [fields, watch, calculateItemAmount]);

  const totals = useMemo(() => {
    const subTotal = itemAmounts.reduce((sum, amount) => sum + amount, 0);
    const totalDiscount = (subTotal * (watch('discountPercent') || 0)) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - (watch('deposit') || 0);

    return { subTotal, totalDiscount, total, balanceDue };
  }, [itemAmounts, watch]);

  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!debouncedSearchTerm) return;

      try {
        const response = await apiService.getLoadByloadNumber(debouncedSearchTerm);
        if (response?.data) {
          const loadData = response.data;
          setLoadDetails(loadData);
          
          const updatedFields = {
            invoiceNumber: loadData.loadNumber,
            location: loadData?.deliveryLocationId?.[0]?.address,
            items: loadData?.items,
            customerEmail: loadData?.customerId?.email,
            customerName: loadData?.customerId?.customerName,
            customerAddress: loadData?.deliveryLocationId?.[0]?.address,
            terms: loadData?.customerId?.paymentTerms?._id,
          };

          Object.entries(updatedFields).forEach(([key, value]) => {
            setValue(key, value);
          });
          toast.success('Load details loaded successfully');
        }
      } catch (error) {
        toast.error("No load found with this number");
        reset(initialinvoiceData);
      }
    };
    fetchLoadDetails();
  }, [debouncedSearchTerm, ]);

  const handleAddItem = () => {
    append({
      itemDetails: '',
      description: '',
      qty: 1,
      rate: 0,
      discount: 0,
      tax: 0, // Initialize tax as number
      amount: 0
    });
  };

  const handleTaxSelect = (index, taxRate) => {
    setValue(`items.${index}.tax`, taxRate);
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'items') {
        formData.append(key, JSON.stringify(value));
      } 
      else if(key === "invoiceDate" || key === "dueDate"){
        formData.append(key, new Date(value).toLocaleDateString('en-GB'));
      }
      else {
        formData.append(key, value);
      }
    });
    
    attachments.forEach(attachment => {
      formData.append('files', attachment.file);
    });
    formData.append("customerId", loadDetails?.customerId?._id);
    formData.append("loadId", loadDetails?._id);
    formData.append("totalAmount", totals.total);
    formData.append("paidAmount", watch('deposit'));
    // due date and invoice data send in dd-mm-yyyy format
   

    await onSubmit(formData);
    reset(initialinvoiceData);
    setAttachments([]);
    setTags([]);
    setSearchTerm('');
  };
console.log("errors",errors)
  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className="invoice-form">
      <div className="invoice-header mb-4">
        <h4>Create Invoice</h4>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Load Number</Form.Label>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter load number to search"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              {...register('invoiceNumber')}
              readOnly
              placeholder="Will be filled from load number"
            />
          </Form.Group>
        </Col>
        <Col md={4} className="text-end">
          <div className="balance-due">
            <h6>BALANCE DUE</h6>
            <h3>${(totals.total - (watch('deposit') || 0)).toFixed(2)}</h3>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              {...register('customerName')}
              readOnly
              placeholder="Customer name will auto-fill"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Customer Email</Form.Label>
            <Form.Control
              type="email"
              {...register('customerEmail')}
              readOnly
              placeholder="Customer email will auto-fill"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Tax Payable"
              checked={isTaxPayable}
              onChange={(e) => setIsTaxPayable(e.target.checked)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Send later"
              checked={sendLater}
              onChange={(e) => setSendLater(e.target.checked)}
            />
          </Form.Group>
        </Col>
      </Row> */}

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group className="billing-address">
            <Form.Label>Billing address</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              {...register('customerAddress')}
              placeholder="Enter billing address"
            />
          </Form.Group>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Terms</Form.Label>
                <Form.Select {...register('terms')}>
                  <option value="">Select Terms</option>
                  <option value="net30">Net 30</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Invoice date</Form.Label>
                <CustomDatePicker
                  name="invoiceDate"
                  value={watch('invoiceDate')}
                  onChange={(e) => setValue('invoiceDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Due date</Form.Label>
                <CustomDatePicker
                  name="dueDate"
                  value={watch('dueDate')}
                  onChange={(e) => setValue('dueDate', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group className="tags-input">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Start typing to add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setTags(prev => [...prev, e.target.value.trim()]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            {tags.length > 0 && (
              <div className="tags-container mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="me-1"
                    onClick={() => setTags(prev => prev.filter((_, i) => i !== index))}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Table responsive className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>PRODUCT/SERVICE</th>
            <th>DESCRIPTION</th>
            <th>QTY</th>
            <th>RATE</th>
            <th>DISCOUNT</th>
            <th>TAX (%)</th>
            <th>AMOUNT</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>{index + 1}</td>
              <td>
                <Form.Control
                  {...register(`items.${index}.itemDetails`)}
                  placeholder="Enter item details"
                />
              </td>
              <td>
                <Form.Control
                  {...register(`items.${index}.description`)}
                  placeholder="Enter description"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  {...register(`items.${index}.qty`)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.rate`)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.discount`)}
                />
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <Form.Select
                    size="sm"
                    value={watch(`items.${index}.tax`)}
                    onChange={(e) => handleTaxSelect(index, parseFloat(e.target.value))}
                  >
                    <option value={0}>No Tax</option>
                    {TAX_OPTIONS.map((tax) => (
                      <option key={tax.id} value={tax.rate}>
                        {tax.name} ({tax.rate}%)
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </td>
              <td>${calculateItemAmount(watch(`items.${index}`)).toFixed(2)}</td>
              <td>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex gap-2 mb-4">
        <Button variant="outline-primary" size="sm" onClick={handleAddItem}>
          Add lines
        </Button>
        <Button variant="outline-primary" size="sm" onClick={() => setValue('items', [])}>
          Clear all lines
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Message on invoice</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('customerNotes')}
              placeholder="Thank you for your business!"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Message on statement</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('terms_conditions')}
              placeholder="Statement message..."
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="attachments-section mb-4">
        <Form.Group>
          <Form.Label><FaPlus /> Attachments</Form.Label>
          <div {...getRootProps({ className: 'dropzone p-3 border rounded' })}>
            <input {...getInputProps()} />
            <p className="text-center mb-0">
              Drag/Drop files here or click to select files
            </p>
          </div>
          {attachments.length > 0 && (
            <div className="attached-files mt-3">
              {attachments.map((file, index) => (
                <div key={index} className="attached-file d-flex align-items-center p-2 border rounded mb-2">
                  <span className="me-auto">{file.file.name}</span>
                  <span className="mx-3 text-muted">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </div>

      <Row>
        <Col md={6}></Col>
        <Col md={6}>
          <div className="totals-section">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>${totals.subTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <span>Discount</span>
                <Form.Control
                  type="number"
                  className="mx-2"
                  style={{ width: '70px' }}
                  {...register('discountPercent')}
                />
                <span>%</span>
              </div>
              <span>${totals.totalDiscount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Balance due</span>
              <span>${totals.balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </Col>
      </Row>
     {/* ERRORS */}
     {
      Object.keys(errors).map((key, index) => (
        <div key={index} className="alert alert-danger">
          {errors[key].message}
        </div>
      ))
     }
      <div className="mt-4 d-flex justify-content-between">
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <FaPrint /> Print
          </Button>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">Save draft</Button>
          <Button variant="primary" type="submit">
            Save and send
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default InvoiceForm;