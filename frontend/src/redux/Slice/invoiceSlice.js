// frontend/src/redux/Slice/invoiceSlice.js
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
      state.attachments = state.attachments.filter(
        (_, index) => index !== action.payload
      );
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    addTag: (state, action) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter((_, index) => index !== action.payload);
    },
    setIsTaxPayable: (state, action) => {
      state.isTaxPayable = action.payload;
    },
    setSendLater: (state, action) => {
      state.sendLater = action.payload;
    },
    setLoadNumber: (state, action) => {
      state.loadNumber = action.payload;
    },
    setLoadDetails: (state, action) => {
      state.loadDetails = action.payload;
    },
    resetInvoice: (state) => {
      return {
        ...state,
        formData: initialinvoiceData,
        attachments: [],
        tags: [],
        isTaxPayable: false,
        sendLater: false,
        loadNumber: '',
        loadDetails: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoadDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoadDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loadDetails = action.payload;
        // Update form data with load details
        state.formData = {
          ...state.formData,
          ...action.payload
        };
      })
      .addCase(fetchLoadDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
        formData: initialinvoiceData,
        attachments: [],
        tags: [],
        isTaxPayable: false,
        sendLater: false,
        loadNumber: '',
        loadDetails: null,
      };
    }
  }
});

export const {
  setFormData,
  updateFormField,
  setAttachments,
  addAttachment,
  removeAttachment,
  setTags,
  addTag,
  removeTag,
  setIsTaxPayable,
  setSendLater,
  setLoadNumber,
  setLoadDetails,
  resetInvoice
} = invoiceSlice.actions;

export default invoiceSlice.reducer;