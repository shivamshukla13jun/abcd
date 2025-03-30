import React from 'react';
import CarrierInvoiceForm from '../CarrierInvoice/CarrierInvoiceForm';
import CustomerInvoiseForm from './CustomerInvoiseForm';

const InvoiceForm = ({ onSubmit ,initialData,invoiceType="customer"}) => {
  return (
     invoiceType === "customer" ? <CustomerInvoiseForm onSubmit={onSubmit} initialData={initialData} /> : <CarrierInvoiceForm onSubmit={onSubmit} initialData={initialData} />
  );
};

export default InvoiceForm;