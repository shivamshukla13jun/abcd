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
import { toast } from 'react-toastify';
import {
  setFormData,
  updateFormField,
  setAttachments,
  addAttachment,
  removeAttachment,
  setLoadNumber,
  fetchLoadDetails,
} from '@/redux/Slice/invoiceSlice';
import useDebounce from '@/hooks/useDebounce';
import ItemsTable from './components/ItemsTable';
import TotalsSection from './components/TotalsSection';
import AttachmentsSection from './components/AttachmentsSection';
import HeaderSection from './components/HeaderSection';
import CustomerSection from './components/CustomerSection';
import NotesSection from './components/NotesSection';
import LoadingSpinner from '@/components/common/LoadingSpinner/Index';

const CarrierInvoiceForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const { 
    formData, 
    attachments, 
    loadNumber,
    loadDetails,
    status 
  } = useSelector(state => state.invoice);

  const debouncedLoadNumber = useDebounce(loadNumber, 500);

  useEffect(() => {
    if (debouncedLoadNumber) {
      dispatch(fetchLoadDetails(debouncedLoadNumber));
    }
  }, [debouncedLoadNumber, dispatch]);

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
      toast.error(error.message || 'Failed to submit form');
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form noValidate onSubmit={handleFormSubmit}>
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
              items={formData.items}
              onChange={(items) => handleFieldChange('items', items)}
            />

            <Grid item xs={6}>
              <NotesSection
                notes={formData.notes}
                onChange={(value) => handleFieldChange('notes', value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TotalsSection formData={formData} onChange={handleFieldChange}/>
            </Grid>

            <AttachmentsSection
              attachments={attachments}
              onAdd={(file) => dispatch(addAttachment(file))}
              onRemove={(index) => dispatch(removeAttachment(index))}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<Send />}
              >
                Submit Invoice
              </Button>
            </Box>
          </Grid>
        )}
      </form>
    </Paper>
  );
};

export default CarrierInvoiceForm;