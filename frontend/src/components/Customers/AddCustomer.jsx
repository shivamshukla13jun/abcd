import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiService from '@service/apiService';
import './AddCustomer.scss';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  company: yup.string().required('Company name is required'),
  customerName: yup.string().required('Customer name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('Zip code is required'),
  mcNumber: yup.string().required('MC Number is required'),
  usdot: yup.string().required('USDOT Number is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  paymentTerms: yup.array().min(1, 'At least one payment term is required'),
  vatNumber: yup.string().required('VAT Registration Number is required'),
  utrNumber: yup.string().required('UTR number is required'),
});

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'bank transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' }
];

const AddCustomer = ({ open, onClose, onSuccess, initialData }) => {
  console.log("initialData", initialData)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      company: initialData?.company || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      mcNumber: initialData?.mcNumber || '',
      usdot: initialData?.usdot || '',
      paymentMethod: initialData?.paymentMethod || '',
      paymentTerms: Array.isArray(initialData?.paymentTerms) ? initialData.paymentTerms : [],
      vatNumber: initialData?.vatNumber || '',
      utrNumber: initialData?.utrNumber || '',
      _id: initialData?._id || undefined,
    }
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
    if (initialData) {
      reset(initialData);
    }
  }, [initialData]);
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (initialData._id) {
        await apiService.updateCustomer(initialData._id, data);
      } else {
        await apiService.createCustomer(data);
      }
      onSuccess();
      onClose();
      reset();
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Customer Name"
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name"
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="State"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Zip Code"
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="mcNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="MC Number"
                    error={!!errors.mcNumber}
                    helperText={errors.mcNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="usdot"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="USDOT Number"
                    error={!!errors.usdot}
                    helperText={errors.usdot?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.paymentMethod}>
                <InputLabel>Payment Method</InputLabel>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Payment Method">
                      {PAYMENT_METHODS.map((method) => (
                        <MenuItem key={method.value} value={method.value}>
                          {method.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.paymentMethod && (
                  <FormHelperText>{errors.paymentMethod.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.paymentTerms}>
                <InputLabel>Payment Terms</InputLabel>
                <Controller
                  name="paymentTerms"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { value, ...field } }) => {
                    console.log("value", value) // {_id,name,days} i get single value now add as a rray 
                    return <Select
                      {...field}
                      value={Array.isArray(value) ? value : []}
                      multiple
                      label="Payment Terms"
                      
                    >
                      {paymentTerms.map((term) => (
                        <MenuItem key={term._id} value={term._id}>
                          {term.name} ({term.days} days)
                        </MenuItem>
                      ))}
                    </Select>
                  }}
                />
                {errors.paymentTerms && (
                  <FormHelperText>{errors.paymentTerms.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="vatNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="VAT Registration Number"
                    error={!!errors.vatNumber}
                    helperText={errors.vatNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="utrNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="UTR Number"
                    error={!!errors.utrNumber}
                    helperText={errors.utrNumber?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomer;
