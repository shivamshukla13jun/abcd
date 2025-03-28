// frontend/src/redux/InitialData/invoice.js
export const initialinvoiceData = {
  invoiceNumber: '',
  invoiceDate: new Date(),
  dueDate: new Date(),
  location: '',
  terms: '',
  customerName: '',
  customerEmail: '',
  customerAddress: '',
  items: [
    {
      itemDetails: '',
      description: '',
      qty: 1,
      rate: 0,
      // discount: 0,
      tax:0,
      amount: 0
    }
  ],
  customerExpense:[],
  customerNotes: '',
  terms_conditions: '',
  discountPercent: 0,
  deposit: 0,
  files: [],
  paymentStatus: 'Unpaid'
};