import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {  Send } from '@mui/icons-material';
import apiService from '@/service/apiService';
import './InvoiceForm.scss';
import { initialinvoiceData } from '@/redux/InitialData/invoice';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import ItemsTable from './components/ItemsTable';
import TotalsSection from './components/TotalsSection';
import AttachmentsSection from './components/AttachmentsSection';
import HeaderSection from './components/HeaderSection';
import CustomerSection from './components/CustomerSection';
import NotesSection from './components/NotesSection';
import { generateInvoiceSchema } from '@/schema/auth/invoiceSchema';
import LoadingSpinner from '@/components/common/LoadingSpinner/Index';
const CustomerInvoiseForm = ({ onSubmit ,initialData,}) => {
  const [searchTerm] = useState(initialData?.loadNumber || '');
  const [attachments, setAttachments] = useState([]);
  const [TAX_OPTIONS,setTAX_OPTIONS] =useState([])
  const [loading, setLoading] = useState(false);
  const [loadDetails, setLoadDetails] = useState(null);
  const [totals, setTotals] = useState({
    subTotal: 0,
    totalDiscount: 0,
    total: 0,
    taxAmount:0,
    balanceDue: 0
  });
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
    name: "customerExpense"
  });
  useEffect(() => {
    return () => attachments.forEach(file => URL.revokeObjectURL(file.preview));
  }, [attachments]);
 useEffect(() => {
    const fetchTaxOptions = async () => {
      try {
        const response = await apiService.getTaxOptions();
        setTAX_OPTIONS(response.data);
      } catch (error) {
        console.error('Error fetching tax options:', error);
      }
    };
    fetchTaxOptions();
  }, []);
// Effect to calculate totals whenever items or relevant values change
useEffect(() => {
  const getSubtotal = () => {
    const baseAmount = watch("customerRate") || 0;
    const totalExpenses = (watch('customerExpense') || [])
      .filter(expense => !isNaN(parseFloat(expense.value)))
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.value);
        return expense.positive ? sum + amount : sum - amount;
      }, 0);
    
    return baseAmount + totalExpenses;
  };

  const subTotal = getSubtotal();
  const discountPercent = watch('discountPercent') || 0;
  const totalDiscount = (subTotal * discountPercent) / 100;
  
  // Safe tax calculation
  const tax = watch('tax');
  const gettax = TAX_OPTIONS?.find((taxOption) => taxOption._id === tax);
  const taxRate = gettax?.value || 0;
  const taxAmount = (subTotal * taxRate) / 100;

  const total = subTotal - totalDiscount + taxAmount;
  const deposit = watch('deposit') || 0;
  const balanceDue = total - deposit;

  // Batch setValue calls to minimize re-renders
  setValue('subTotal', subTotal);
  setValue('totalDiscount', totalDiscount);
  setValue('taxAmount', taxAmount);
  setValue('totalAmount', total);
  setValue('total', total);
  setValue('balanceDue', balanceDue);
  
  // Update state
  setTotals({ 
    subTotal, 
    totalDiscount, 
    taxAmount, 
    total, 
    balanceDue 
  });
}, [
  watch("discountPercent"), 
  watch("tax"), 
  watch("deposit"), 
  watch("customerRate"), 
  watch("customerExpense")
]);

  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!debouncedSearchTerm) return;

      try {
        setLoading(true);
        const response = await apiService.getLoadByloadNumber(debouncedSearchTerm);
        if (response?.data) {
          const loadData = response.data;
          setLoadDetails(loadData);
          
          const updatedFields = {
            invoiceNumber: loadData.loadNumber,
            location: loadData?.deliveryLocationId?.[0]?.address,
            items: loadData?.items,
            
            customerId: loadData?.customerId?._id,
            customerEmail:loadData?.customerId?.email,
            customerName:loadData?.customerId?.customerName,
            customerAddress:loadData?.customerId?.address,
            terms:loadData?.customerId?.paymentTerms?.[0]?._id,
            customerId:loadData?.customerId?._id,
            customerExpense:loadData?.customerExpense,
            customerRate:loadData?.customerRate,
           
          };
          setAttachments(loadData?.files || []);

          Object.entries(updatedFields).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      } catch (error) {
        toast.error("No load found with this number");
        setLoading(false);
        reset(initialinvoiceData);
      } finally {
        setLoading(false);
      }
    };
    fetchLoadDetails();
  }, [debouncedSearchTerm, ]);

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      // Append all form fields
         formData.append("invoiceData", JSON.stringify(data));
      // Append files
      attachments.forEach(attachment => {
        if (attachment.file) {
          formData.append('files', attachment.file);
        }
      });
      console.log("submit data",formData)
      await onSubmit(formData);
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };
console.log("errorrss",errors)
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
         {loading ? <LoadingSpinner/>:<Grid container spacing={3}>
          {/* Header Section */}
           {/* Customer Details */}
           
            <Grid item xs={6}>
          <HeaderSection 
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            customerId={loadDetails?.customerId}

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

          {/* Items Table */}
          <ItemsTable 
            fields={fields}
            register={register}
            remove={remove}
            append={append}
            watch={watch}
            setValue={setValue}
          />
          {/* Totals */}
          <Grid item xs={6}>
            {/* Customer notes */}
            {/* Notes and Terms */}
          <NotesSection 
            register={register}
            errors={errors}
          />
          </Grid>
          <Grid item xs={6}>
            <TotalsSection 
              totals={totals}
              register={register}
              watch={watch}
              TAX_OPTIONS={TAX_OPTIONS}
          />
           {/* Attachments */}
           {/* atechment healine */}
           <Typography variant="span" gutterBottom>Attachments</Typography>
          <AttachmentsSection 
            attachments={attachments}
            setAttachments={setAttachments}
            setValue={setValue}
            watch={watch}
          />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                // startIcon={<Print />}
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
                  onClick={handleSubmit(handleFormSubmit)}
                  startIcon={<Send />}
                >
                  Save and Send
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>}
        
      </form>
    </Paper>
  );
};

export default CustomerInvoiseForm;