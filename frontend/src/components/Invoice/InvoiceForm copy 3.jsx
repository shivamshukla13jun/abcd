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
const InvoiceForm = ({ onSubmit ,initialData}) => {
  const [searchTerm, setSearchTerm] = useState(initialData?.loadNumber || '');
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
    resolver: yupResolver(generateInvoiceSchema),
    defaultValues:  initialData || initialinvoiceData
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

  // Replace the useMemo implementation with state and useEffect
const [totals, setTotals] = useState({
  subTotal: 0,
  totalDiscount: 0,
  total: 0,
  balanceDue: 0
});

// Effect to calculate totals whenever items or relevant values change
useEffect(() => {
  const subTotal = itemAmounts.reduce((sum, amount) => sum + amount, 0);
  const totalDiscount = (subTotal * (watch('discountPercent') || 0)) / 100;
  const total = subTotal - totalDiscount;
  const balanceDue = total - (watch('deposit') || 0);

  setTotals({ subTotal, totalDiscount, total, balanceDue });
}, [itemAmounts, watch('discountPercent'), watch('deposit')]);

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
   const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = watch();
      const formattedData = {
        ...data,
        // invoiceDate: format(new Date(data.invoiceDate), 'dd-MM-yyyy'),
        // dueDate: format(new Date(data.dueDate), 'dd-MM-yyyy'),
        // items: data.items.map(item => ({ ...item, amount: Number(item.amount) })),
        customerId: loadDetails?.customerId?._id,
        loadId: loadDetails?._id,
        loadNumber: data.invoiceNumber,
        totalAmount: data.total,
        paidAmount: data.deposit,
      };

      const formData = new FormData();
      formData.append('invoiceData', JSON.stringify(formattedData));

      attachments.forEach(attachment => {
        formData.append('files', attachment.file);
      });

      await onSubmit(formData);
      // toast.success('Invoice saved successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  const handleFormReset = () => {
    reset(initialinvoiceData);
    setAttachments([]);
    setTags([]);
    setSearchTerm('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Invoice
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          {/* Header Section */}
          <HeaderSection 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            register={register}
            balanceDue={totals.balanceDue}
          />

          {/* Customer Details */}
          <CustomerSection 
            register={register}
            errors={errors}
          />

          {/* Items Table */}
          <ItemsTable 
            fields={fields}
            register={register}
            remove={remove}
            append={append}
            watch={watch}
            setValue={setValue}
          />

          {/* Notes and Terms */}
          <NotesSection 
            register={register}
            errors={errors}
          />

          {/* Attachments */}
          <AttachmentsSection 
            attachments={attachments}
            setAttachments={setAttachments}
          />

          {/* Totals */}
          <Grid item xs={12}>
            {/*  */}
          <TotalsSection 
            totals={totals}
            register={register}
            watch={watch}
          />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                startIcon={<Print />}
                variant="outlined"
              >
                Print
              </Button>
              <Box>
                {/* <Button
                  variant="outlined"
                  startIcon={<Save />}
                  sx={{ mr: 1 }}
                >
                  Save Draft
                </Button> */}
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleFormSubmit}
                  startIcon={<Send />}
                >
                  Save and Send
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default InvoiceForm;