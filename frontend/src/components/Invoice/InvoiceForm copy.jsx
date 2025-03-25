import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  Chip,
  Box,
  Divider
} from '@mui/material';
import { Delete, Add, Print, Save, Send } from '@mui/icons-material';
import apiService from '@/service/apiService';
import './InvoiceForm.scss';
import { initialinvoiceData } from '@/redux/InitialData/invoice';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import CustomDatePicker from '@/components/common/CommonDatePicker';
import { useDropzone } from 'react-dropzone';
import { TAX_OPTIONS } from './constants';
import ItemsTable from './components/ItemsTable';
import TotalsSection from './components/TotalsSection';
import AttachmentsSection from './components/AttachmentsSection';
import HeaderSection from './components/HeaderSection';
import CustomerSection from './components/CustomerSection';
import NotesSection from './components/NotesSection';
import { generateInvoiceSchema } from '@/schema/auth/invoiceSchema';
import { format, formatDate } from 'date-fns';

const InvoiceForm = ({ onSubmit, initialData }) => {
  console.log("initialData", initialData);
  const [searchTerm, setSearchTerm] = useState(initialData?.loadNumber || '');
  const [attachments, setAttachments] = useState(initialData?.files || []);
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
    resolver: yupResolver(generateInvoiceSchema),
    defaultValues: initialData || initialinvoiceData
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSearchTerm(initialData.loadNumber || '');
      setAttachments(initialData.files || []);
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
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

  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!debouncedSearchTerm) {
        setLoadDetails(null);
        return;
      }

      try {
        const response = await apiService.getLoadByNumber(debouncedSearchTerm);
        const loadData = response.data;
        

        if (loadData) {
          const updatedFields = {
            customerId: loadData?.customerId,
            customerName: loadData?.customerName,
            customerEmail: loadData?.customerEmail,
            customerAddress: loadData?.customerAddress,
            location: loadData?.deliveryLocationId?.[0]?.address,
            items: loadData?.items,
          };
          setAttachments(loadData?.files || []);

          Object.entries(updatedFields).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      } catch (error) {
        console.error('Error fetching load details:', error);
        toast.error('Error fetching load details');
      }
    };

    fetchLoadDetails();
  }, [debouncedSearchTerm]);

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === 'items') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Append files
      attachments.forEach(attachment => {
        if (attachment.file) {
          formData.append('files', attachment.file);
        }
      });

      await onSubmit(formData);
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const totals = useMemo(() => {
    const subTotal = itemAmounts.reduce((sum, amount) => sum + amount, 0);
    const discountPercent = watch('discountPercent') || 0;
    const deposit = watch('deposit') || 0;
    const totalDiscount = (subTotal * discountPercent) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - deposit;
    // setValue('totalAmount', total);
    // setValue('balanceDue', balanceDue);
    // setValue('discountAmount', totalDiscount);
    // setValue('deposit', deposit);


    return {
      subTotal,
      totalDiscount,
      total,
      balanceDue
    };
  }, [itemAmounts, watch]);
console.log("errrrr",errors)
console.log("watch",watch())
console.log("totals",totals)
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <HeaderSection
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  register={register}
                  balanceDue={totals.balanceDue}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomerSection
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <ItemsTable
              fields={fields}
              register={register}
              remove={remove}
              append={append}
              errors={errors}
              watch={watch}
              setValue={setValue}
              calculateItemAmount={calculateItemAmount}
            />
          </Grid>

          <Grid item xs={12}>
            <TotalsSection
              register={register}
              errors={errors}
              watch={watch}
              totals={totals}
            />
          </Grid>

          <Grid item xs={12}>
            <AttachmentsSection
              attachments={attachments}
              setAttachments={setAttachments}
            />
          </Grid>

          <Grid item xs={12}>
            <NotesSection
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
              >
                Save Invoice
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default InvoiceForm;