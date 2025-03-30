import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import apiService from '@/service/apiService';
import './InvoiceForm.scss';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import ItemsTable from './components/ItemsTable';
import TotalsSection from './components/TotalsSection';
import AttachmentsSection from './components/AttachmentsSection';
import HeaderSection from './components/HeaderSection';
import CustomerSection from './components/CustomerSection';
import NotesSection from './components/NotesSection';
import LoadingSpinner from '@/components/common/LoadingSpinner/Index';
import {
  setFormData,
  updateFormField,
  setAttachments,
  addAttachment,
  removeAttachment,
  setLoadNumber,
  fetchLoadDetails,
  updateTotals
} from '@/redux/Slice/invoiceSlice';

const CustomerInvoiceForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const { 
    formData, 
    attachments, 
    loadNumber,
    loadDetails,
    status,
    totals,
    TAX_OPTIONS 
  } = useSelector(state => state.invoice);

  const debouncedLoadNumber = useDebounce(loadNumber, 800);

  useEffect(() => {
    if (debouncedLoadNumber) {
      dispatch(fetchLoadDetails(debouncedLoadNumber));
    }
  }, [debouncedLoadNumber, dispatch]);

  useEffect(() => {
    const calculateTotals = () => {
      const subTotal = formData.customerRate || 0;
      const discountPercent = formData.discountPercent || 0;
      const totalDiscount = (subTotal * discountPercent) / 100;

      const taxOption = TAX_OPTIONS.find(option => option._id === formData.tax);
      const taxRate = taxOption?.value || 0;
      const taxAmount = (subTotal * taxRate) / 100;

      const total = subTotal - totalDiscount + taxAmount;
      const balanceDue = total - (formData.deposit || 0);

      dispatch(updateTotals({
        subTotal,
        totalDiscount,
        taxAmount,
        total,
        balanceDue
      }));
    };

    calculateTotals();
  }, [formData, TAX_OPTIONS, dispatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      const invoiceData = {
        ...formData,
        attachments: attachments.map(att => ({
          name: att.name,
          url: att.url || att.preview
        }))
      };

      formDataObj.append("invoiceData", JSON.stringify(invoiceData));

      attachments.forEach(attachment => {
        if (attachment.file) {
          formDataObj.append('files', attachment.file);
        }
      });

      await onSubmit(formDataObj);
      toast.success('Form submitted successfully');
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message);
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleFormSubmit}>
        {status === 'loading' ? <LoadingSpinner /> : (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <HeaderSection
                formData={formData}
                onChange={handleFieldChange}
                loadNumber={loadNumber}
                setLoadNumber={(value) => dispatch(setLoadNumber(value))}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomerSection
                formData={formData}
                onChange={handleFieldChange}
              />
            </Grid>

            <ItemsTable
              items={formData.customerExpense}
              onChange={(items) => handleFieldChange('customerExpense', items)}
              totals={totals}
            />

            <Grid item xs={6}>
              <NotesSection
                notes={formData.notes}
                onChange={(value) => handleFieldChange('notes', value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TotalsSection
                totals={totals}
                formData={formData}
                onChange={handleFieldChange}
                TAX_OPTIONS={TAX_OPTIONS}
              />

              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>
              <AttachmentsSection
                attachments={attachments}
                onAdd={(file) => dispatch(addAttachment(file))}
                onRemove={(index) => dispatch(removeAttachment(index))}
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

export default CustomerInvoiceForm;