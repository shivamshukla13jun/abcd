import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { FaPrint } from 'react-icons/fa';
import apiService from '@/service/apiService';
import './InvoiceForm.scss';
import { initialDocumentUpload } from '@/redux/InitialData/Load';
import { initialinvoiceData } from '@/redux/InitialData/invoice';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import CustomDatePicker from '@/components/common/CommonDatePicker';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormData,
  updateFormField,
  setAttachments,
  addAttachment,
  removeAttachment,
  setTags,
  addTag,
  removeTag,
  setIsTaxPayable,
  setSendLater,
  setLoadNumber,
  setLoadDetails,
  resetInvoice
} from '@/redux/Slice/invoiceSlice';
// Validation schema
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
      tax: yup.object().shape({
        selected: yup.bool(),
        option: yup.object().shape({
          id: yup.number(),
          name: yup.string(),
          agency: yup.string(),
          rate: yup.number().min(0).max(100)
        }),
        amount: yup.number().min(0)
      }),
      amount: yup.number().min(0)
    })
  ),
  customerNotes: yup.string(),
  terms_conditions: yup.string(),
  discountPercent: yup.number().min(0).max(100),
  deposit: yup.number().min(0)
});

// Add these new constants
const TAX_OPTIONS = [
  { id: 1, name: 'GST', agency: 'Government', rate: 5 },
  { id: 2, name: 'VAT', agency: 'State', rate: 12.5 },
  { id: 3, name: 'Sales Tax', agency: 'Local', rate: 8 },
];

const InvoiceForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const {
    formData,
    attachments,
    tags,
    isTaxPayable,
    sendLater,
    loadNumber,
    loadDetails
  } = useSelector((state) => state.invoice);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  
  const defaultValues = formData || initialinvoiceData
  const { register, handleSubmit, watch, reset, setValue, formState: { errors }, control } = useForm({
    resolver: yupResolver(invoiceSchema),
    defaultValues: defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Add these state variables at the top of the component
  const [isAddingTerm, setIsAddingTerm] = useState(false);
  const [newTermName, setNewTermName] = useState('');
  const [newTermDays, setNewTermDays] = useState('');

  // Add state for tag input
  const [tagInput, setTagInput] = useState('');

  // Add dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 20971520, // 20MB
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file)
      }));
      dispatch(setAttachments([...attachments, ...newAttachments]));
    }
  });

  // Cleanup previews on unmount
  useEffect(() => {
    return () => attachments.forEach(file => URL.revokeObjectURL(file.preview));
  }, [attachments]);

  // Function to handle adding a new item
  const handleAddItem = () => {
    append({
      itemDetails: '',
      description: '',
      qty: 1,
      rate: 0,
      discount: 0,
      tax: {
        selected: false,
        option: null,
        amount: 0
      },
      amount: 0
    });
  };

  // Function to handle tax selection
  const handleTaxSelect = (index, taxOption) => {
    const item = fields[index];
    const taxAmount = (item.qty * item.rate * taxOption.rate) / 100;
    
    setValue(`items.${index}.tax`, {
      selected: true,
      option: taxOption,
      amount: taxAmount
    });
  };

  // Memoize the calculateItemAmount function
  const calculateItemAmount = useCallback((item) => {
    if (!item) return 0;
    const baseAmount = (item.qty || 0) * (item.rate || 0);
    const taxAmount = item.tax?.amount || 0;
    const discountAmount = item.discount || 0;
    return Number((baseAmount + taxAmount - discountAmount).toFixed(2));
  }, []);

  // Memoize individual item amounts
  const itemAmounts = useMemo(() => {
    return fields.map((field, index) => {
      const item = watch(`items.${index}`);
      return calculateItemAmount(item);
    });
  }, [fields, watch, calculateItemAmount]);

  // Memoize totals calculations
  const totals = useMemo(() => {
    const subTotal = itemAmounts.reduce((sum, amount) => sum + amount, 0);
    const totalDiscount = (subTotal * (watch('discountPercent') || 0)) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - (watch('deposit') || 0);

    return {
      subTotal,
      totalDiscount,
      total,
      balanceDue
    };
  }, [itemAmounts, watch]);
// Update the useEffect for initializing and syncing form data
useEffect(() => {
  // Initialize form with Redux data
  reset(formData || initialinvoiceData);
}, [reset, formData]); // Reset form when formData changes

// Update the load details effect to use setValue
useEffect(() => {
  const fetchLoadDetails = async () => {
    if (!debouncedSearchTerm) return;

    try {
      const response = await apiService.getLoadByloadNumber(debouncedSearchTerm);
      if (response?.data) {
        const loadData = response.data;
        const updatedFormData = {
          invoiceNumber: loadData.loadNumber,
          location: loadData?.deliveryLocationId?.[0]?.address,
          items: loadData?.items,
          files: loadData?.files,
          customerEmail: loadData?.customerId?.email,
          customerName: loadData?.customerId?.customerName,
          customerAddress: loadData?.deliveryLocationId?.[0]?.address,
          terms: loadData?.customerId?.paymentTerms?._id,
        };

        // Update form values directly
        Object.entries(updatedFormData).forEach(([key, value]) => {
          setValue(key, value);
        });

        toast.success('Load details loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching load details:', error);
      toast.error("No load found with this number");
      reset(initialinvoiceData);
    }
  };

  fetchLoadDetails();
}, [debouncedSearchTerm, dispatch, setValue, reset]);
  // Watch for changes to calculate totals
  const items = watch('items');
  const discountPercent = watch('discountPercent') || 0;

  // Calculate totals
  const subTotal = items?.reduce((sum, item) => sum + calculateItemAmount(item), 0) || 0;
  const totalDiscount = (subTotal * discountPercent) / 100;
  const total = subTotal - totalDiscount;

  // Add this function to handle payment term creation
  const handleAddPaymentTerm = async () => {
    try {
      const response = await apiService.createPaymentTerm({
        name: newTermName,
        days: parseInt(newTermDays)
      });
      
      // Update the form with new term
      setValue('terms', response.data._id);
      
      // Calculate and set new due date based on term days
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + parseInt(newTermDays));
      setValue('dueDate', newDueDate.toISOString().split('T')[0]);
      
      setIsAddingTerm(false);
      setNewTermName('');
      setNewTermDays('');
      
      toast.success('Payment term added successfully');
    } catch (error) {
      toast.error('Failed to add payment term');
      console.error('Error adding payment term:', error);
    }
  };

  // Add this function to handle terms change
  const handleTermsChange = (e) => {
    const selectedTermId = e.target.value;
    setValue('terms', selectedTermId);
    
    // Find selected term and update due date
    const selectedTerm = loadDetails?.customerId?.paymentTerms?.find(
      term => term._id === selectedTermId
    );
    
    if (selectedTerm) {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + selectedTerm.days);
      setValue('dueDate', newDueDate.toISOString().split('T')[0]);
    }
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      dispatch(addTag(tagInput.trim()));
      setTagInput('');
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    
    // Append form data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Append files
    attachments.forEach(attachment => {
      formData.append('files', attachment.file);
    });
    
    // Submit the form
    await onSubmit(formData);
    
    // Reset form after successful submission
    dispatch(resetInvoice());
  };

  // Update Redux when form fields change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name) {
        dispatch(updateFormField({ field: name, value: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                dispatch(setLoadNumber(e.target.value));
              }}
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
            <h3>${(total - (watch('deposit') || 0)).toFixed(2)}</h3>
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

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Tax Payable"
              checked={isTaxPayable}
              onChange={(e) => dispatch(setIsTaxPayable(e.target.checked))}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Send later"
              checked={sendLater}
              onChange={(e) => dispatch(setSendLater(e.target.checked))}
            />
          </Form.Group>
        </Col>
      </Row>

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
                <Form.Select {...register('terms')} onChange={handleTermsChange}>
                  <option value="">Select Terms</option>
                  <option value="net30">Net 30</option>
                  {/* Add other terms options */}
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
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInput}
                placeholder="Start typing to add a tag"
              />
              <Button variant="link" className="ms-2">
                Manage tags
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="tags-container mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="me-1"
                    onClick={() => {
                      dispatch(removeTag(index));
                    }}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Items Table */}
      <Table responsive className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>PRODUCT/SERVICE</th>
            <th>DESCRIPTION</th>
            <th>QTY</th>
            <th>RATE</th>
            <th>DISCOUNT</th>
            <th>TAX</th>
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
              <td style={{ width: '100px' }}>
                <Form.Control
                  type="number"
                  min="1"
                  {...register(`items.${index}.qty`)}
                />
              </td>
              <td style={{ width: '120px' }}>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.rate`)}
                />
              </td>
              <td style={{ width: '100px' }}>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.discount`)}
                />
              </td>
              <td>
                <div className="d-flex align-items-center">
                  {fields[index]?.tax?.selected ? (
                    <>
                      <span className="me-2">
                        {fields[index].tax.option.name} ({fields[index].tax.option.rate}%)
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => setValue(`items.${index}.tax`, { selected: false, option: null, amount: 0 })}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  ) : (
                    <Form.Select
                      size="sm"
                      onChange={(e) => handleTaxSelect(index, TAX_OPTIONS[e.target.value])}
                    >
                      <option value="">Add Tax</option>
                      {TAX_OPTIONS.map((tax, i) => (
                        <option key={tax.id} value={i}>
                          {tax.name} - {tax.agency} ({tax.rate}%)
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </div>
              </td>
              <td>${calculateItemAmount(fields[index]).toFixed(2)}</td>
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
        <Button variant="outline-primary" size="sm">
          Add subtotal
        </Button>
      </div>

      {/* Message sections */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Message on invoice</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('customerNotes')}
              placeholder="Thank you for your business and have a great day!"
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
              placeholder="If you send statements to customers, this will show up on the statement."
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Attachments */}
      <div className="attachments-section mb-4">
        <Form.Group>
          <Form.Label>
            <FaPlus /> Attachments
          </Form.Label>
          <div {...getRootProps({ className: 'dropzone p-3 border rounded' })}>
            <input {...getInputProps()} />
            <p className="text-center mb-0">
              Drag/Drop files here or click to select files
            </p>
            <small className="text-muted d-block text-center">
              Maximum size: 20MB
            </small>
          </div>
          {attachments.length > 0 && (
            <div className="attached-files mt-3">
              {attachments.map((file, index) => (
                <div key={index} className="attached-file d-flex align-items-center p-2 border rounded mb-2">
                  <span className="me-auto">{file.name}</span>
                  <span className="mx-3 text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => dispatch(removeAttachment(index))}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </div>

      {/* Totals section */}
      <Row>
        <Col md={6}></Col>
        <Col md={6}>
          <div className="totals-section">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>${subTotal.toFixed(2)}</span>
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
              <span>${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Need help with sales tax?</span>
              <Button variant="link">Learn more</Button>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Balance due</span>
              <span>${(total - (watch('deposit') || 0)).toFixed(2)}</span>
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-4 d-flex justify-content-between">
        <div className="d-flex gap-2">
          <Button variant="outline-primary">Preview</Button>
          <Button variant="outline-primary">Print or Preview</Button>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">Save as draft</Button>
          <Button variant="primary" type="submit">
            Save and send
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default InvoiceForm; 