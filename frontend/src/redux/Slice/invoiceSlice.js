import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialinvoiceData } from '../InitialData/invoice';
import apiService from '@/service/apiService';

export const fetchLoadDetails = createAsyncThunk(
  'invoice/fetchLoadDetails',
  async (loadNumber) => {
    const response = await apiService.getLoadByloadNumber(loadNumber);
    return response.data;
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    formData: initialinvoiceData,
    attachments: [],
    tags: [],
    isTaxPayable: false,
    sendLater: false,
    loadNumber: '',
    loadDetails: null,
    status: 'idle',
    error: null,
    totals: {
      subTotal: 0,
      totalDiscount: 0,
      taxAmount: 0,
      total: 0,
      balanceDue: 0
    },
    TAX_OPTIONS: []
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setAttachments: (state, action) => {
      state.attachments = action.payload;
    },
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    removeAttachment: (state, action) => {
      state.attachments.splice(action.payload, 1);
    },
    setLoadNumber: (state, action) => {
      state.loadNumber = action.payload;
    },
    updateTotals: (state, action) => {
      state.totals = action.payload;
    },
    setTaxOptions: (state, action) => {
      state.TAX_OPTIONS = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoadDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoadDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loadDetails = action.payload;
        state.formData = {
          ...state.formData,
          invoiceNumber: action.payload.loadNumber,
          location: action.payload?.deliveryLocationId?.[0]?.address,
          items: action.payload?.items,
          customerEmail: action.payload?.customerId?.email,
          customerName: action.payload?.customerId?.customerName,
          customerAddress: action.payload?.customerId?.address,
          terms: action.payload?.customerId?.paymentTerms?.[0]?._id,
          customerId: action.payload?.customerId?._id,
          customerExpense: action.payload?.customerExpense || [],
          customerRate: action.payload?.customerRate,
        };
        state.attachments = action.payload?.files || [];
      })
      .addCase(fetchLoadDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  setFormData,
  updateFormField,
  setAttachments,
  addAttachment,
  removeAttachment,
  setLoadNumber,
  updateTotals,
  setTaxOptions
} = invoiceSlice.actions;

export default invoiceSlice.reducer;