import React, { useEffect, useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardHeader,
  CardContent,
  Modal,
  Box,
  Typography,
  Paper
} from '@mui/material';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import apiService from '@/service/apiService';
import { toast } from 'react-toastify';
import './Invoices.scss';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
};

const Invoices = () => {
  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Fetch invoices
  const fetchInvoicesData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInvoices();
      setInvoices(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices');
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesData();
  }, []);



  const handleCreateInvoice = async (data) => {
    try {
      await apiService.generateInvoice(data);
      toast.success('Invoice created successfully');
      fetchInvoicesData();
      setShowInvoiceModal(false);
    } catch (error) {
      toast.error('Failed to create invoice');
      toast.error(error.message);
    }
  };

  const handleEditInvoice = async (data) => {
    try {
      console.log("data ???",data)
      await apiService.updateInvoice(editingInvoice._id, data);
      toast.success('Invoice updated successfully');
      fetchInvoicesData();
      handleCloseModal();
    } catch (error) {
      console.log("error",error)
      // toast.error('Failed to update invoice');
      toast.error(error.message);
    }
  };

  const handleGeneratePDF = async (invoiceId) => {
    try {
      const response = await apiService.getInvoicePdf(invoiceId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      // toast.error('Failed to generate PDF');
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="invoices-page">
      <Card>
        <CardHeader
          title="Invoice Management"
          // action={
          //   <Button 
          //     variant="contained" 
          //     color="primary" 
          //     onClick={() => setShowInvoiceModal(true)}
          //   >
          //     Create New Invoice
          //   </Button>
          // }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleGeneratePDF(invoice._id)}
                      >
                        Generate PDF
                      </Button>
                      <Button 
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setEditingInvoice({...invoice,loadNumber:invoice.invoiceNumber});
                          setShowInvoiceModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Modal 
        open={showInvoiceModal}
        onClose={handleCloseModal}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </Typography>
          <InvoiceForm
            onSubmit={editingInvoice ? handleEditInvoice : handleCreateInvoice}
            initialData={editingInvoice}
            // label={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}

          />
        </Box>
      </Modal>
    </div>
  );
};

export default Invoices;
