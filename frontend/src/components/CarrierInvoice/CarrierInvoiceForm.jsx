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
import { Send } from '@mui/icons-material';
import apiService from '@/service/apiService';

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

const CarrierInvoiceForm = ({ onSubmit, initialData }) => {
  const[currenttime,setCurrentTime]=useState(Date.now());
  console.log("initialData??????",initialData)
  const [searchTerm] = useState(initialData?.loadNumber || '');
  const [attachments, setAttachments] = useState([]);
  const [TAX_OPTIONS, setTAX_OPTIONS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadDetails, setLoadDetails] = useState(null);
  const [totals, setTotals] = useState({
    subTotal: 0,
    totalDiscount: 0,
    total: 0,
    taxAmount: 0,
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
    defaultValues: initialData});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "carrierExpense"
  });

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      attachments.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [attachments]);

  // Fetch tax options
  useEffect(() => {
    const fetchTaxOptions = async () => {
      try {
        const response = await apiService.getTaxOptions();
        setTAX_OPTIONS(response.data);
        // Set default tax value if not already set
        // if (!watch('tax') && response.data.length > 0) {
        //   setValue('tax', response.data[0]._id);
        // }
      } catch (error) {
        console.error('Error fetching tax options:', error);
      }
    };
    fetchTaxOptions();
  }, [setValue, watch]);

  // Calculate totals
  const getSubtotal = () => {
    const loadAmount = parseFloat(watch("loadAmount")) || 0;
    const dispatchRate = parseFloat(watch("dispatchRate")) || 0; // Ensure valid number
   const baseAmount=(dispatchRate/100)*loadAmount
   
    const totalExpenses = fields.reduce((sum, expense) => {
      const amount = parseFloat(expense.value) || 0;
      return expense.positive ? sum + amount : sum - amount;
    }, 0);
    return baseAmount + totalExpenses;
  };
  useEffect(() => {
    const subTotal = getSubtotal();
    const discountPercent = parseFloat(watch('discountPercent')) || 0;
    const totalDiscount = (subTotal * discountPercent) / 100;

    const taxId = watch('tax');
    const taxOption = TAX_OPTIONS.find(option => option._id === taxId);
    const taxRate = taxOption?.value || 0;
    const taxAmount = (subTotal * taxRate) / 100;

    const total = subTotal - totalDiscount + taxAmount;
    const deposit = parseFloat(watch('deposit')) || 0;
    const balanceDue = total - deposit;

    setValue('subTotal', subTotal);
    setValue('totalDiscount', totalDiscount);
    setValue('taxAmount', taxAmount);
    setValue('totalAmount', total);
    setValue('total', total);
    setValue('balanceDue', balanceDue);

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
    watch("dispatchRate"),
    fields,currenttime,
    setValue,
  ]);
  
  // Fetch load details
  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!debouncedSearchTerm) return;

      try {
        setLoading(true);
        const response = await apiService.getLoadByloadNumber(debouncedSearchTerm);
        if (response?.data) {
          const loadData = response.data;
          setLoadDetails(loadData);
          const carrierData = loadData.carrierIds?.[0]?.carrier;
          const carrierExpenses = loadData.carrierIds?.[0]?.carrierExpense || [];
          console.log("carrir data",carrierData)
          const updatedFields = {
            ...initialinvoiceData,
            invoiceNumber: loadData.loadNumber,
            location: loadData?.deliveryLocationId?.[0]?.address,
            items: loadData?.items,
            customerEmail: carrierData?.contactEmail,
            customerName: carrierData?.companyName,
            customerAddress: carrierData?.address,
            carrierId: carrierData?._id,
            carrierExpense: carrierExpenses,
            loadAmount: loadData.loadAmount,
            dispatchRate: loadData.carrierIds?.[0]?.dispatchRate || 0,
            ...initialData
          };
          setAttachments(loadData?.files || []);
          reset(updatedFields);
        }
      } catch (error) {
        toast.error("No load found with this number");
        reset(initialinvoiceData);
        setLoadDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLoadDetails();
  }, [debouncedSearchTerm, reset]);

 console.log("initialData",initialData)
  const handleFormSubmit = async (data, e) => {
    try {
      e.preventDefault(); // Prevent default form submission
      console.log('Form submission started', data);
      
      if (!onSubmit) {
        throw new Error('onSubmit handler is not provided');
      }
    console.log("daata",data)
      const formData = new FormData();
      const invoiceData = {
        ...data,
       
      };

      console.log('Prepared invoice data:', invoiceData);
      formData.append("invoiceData", JSON.stringify(invoiceData));
      
      attachments.forEach(attachment => {
        if (attachment.file) {
          formData.append('files', attachment.file);
        }
      });

      await onSubmit(formData);
      toast.success('Form submitted successfully');
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || 'Failed to submit form');
    }
  };
console.log({errors})
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form noValidate onSubmit={(e) => handleSubmit((data) => handleFormSubmit(data, e))(e)}>
        {loading ? <LoadingSpinner /> : (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <HeaderSection
                register={register}
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

            <ItemsTable
              fields={fields}
              register={register}
              remove={remove}
              append={append}
              watch={watch}
              setValue={setValue}
              totals={totals}
              setTotals={setTotals}
            />

            <Grid item xs={6}>
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
                getSubtotal={getSubtotal}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>
              <AttachmentsSection
                attachments={attachments}
                setAttachments={setAttachments}
                setValue={setValue}
                watch={watch}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined">
                  Print
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  disabled={loading || Object.keys(errors).length > 0}
                >
                  Save and Send
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </form>
    </Paper>
  );
};

export default CarrierInvoiceForm;
