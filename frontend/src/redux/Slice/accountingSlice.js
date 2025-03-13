import api from '@/utils/axiosInterceptor';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchPayments = createAsyncThunk(
  'accounting/fetchPayments',
  async () => {
    const response = await api.get('/payments');
    return response.data.data;
  }
);

export const fetchInvoices = createAsyncThunk(
  'accounting/fetchInvoices',
  async () => {
    const response = await api.get('/invoices');
    return response.data.data;
  }
);

export const fetchExpenses = createAsyncThunk(
  'accounting/fetchExpenses',
  async () => {
    const response = await api.get('/expenses');
    return response.data.data;
  }
);

export const uploadDocument = createAsyncThunk(
  'accounting/uploadDocument',
  async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
);

const initialState = {
  payments: {
    data: [],
    loading: false,
    error: null,
  },
  invoices: {
    data: [],
    loading: false,
    error: null,
  },
  expenses: {
    data: [],
    loading: false,
    error: null,
  },
  documents: {
    data: [],
    loading: false,
    error: null,
  },
  todoList: [],
  activeTab: 'payments',
};

const accountingSlice = createSlice({
  name: 'accounting',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addDocument : (state, action) => {
      state.documents.data.push(action.payload);
    },
    removeDocument : (state, action) => {
      state.documents.data = state.documents.data.filter(doc => doc.id !== action.payload);
    },
    addPayment:(state, action) => {
      state.payments.data.push(action.payload);
    },
    removePayment:(state, action) => {
      state.payments.data = state.payments.data.filter(doc => doc.id !== action.payload);
    },  
    addInvoice    : (state, action) => {  
      state.invoices.data.push(action.payload);
    },
    removeInvoice     : (state, action) => {    
      state.invoices.data = state.invoices.data.filter(doc => doc.id !== action.payload);
    },  
    addExpense    : (state, action) => {  
      state.expenses.data.push(action.payload);
    },
    removeExpense     : (state, action) => {    
      state.expenses.data = state.expenses.data.filter(doc => doc.id !== action.payload);
    },
    addTodoItem: (state, action) => {
      state.todoList.push(action.payload);
    },
    removeTodoItem: (state, action) => {
      state.todoList = state.todoList.filter(item => item.id !== action.payload);
    },
    toggleTodoItem: (state, action) => {
      const item = state.todoList.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },
  },
  extraReducers: (builder) => {
    // Payments
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.payments.loading = true;
        state.payments.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments.loading = false;
        state.payments.data = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.payments.loading = false;
        state.payments.error = action.error.message;
      })

    // Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.invoices.loading = true;
        state.invoices.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.data = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = action.error.message;
      })

    // Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.expenses.loading = true;
        state.expenses.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses.loading = false;
        state.expenses.data = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error = action.error.message;
      })

    // Document Upload
      .addCase(uploadDocument.pending, (state) => {
        state.documents.loading = true;
        state.documents.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documents.loading = false;
        state.documents.data.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.documents.loading = false;
        state.documents.error = action.error.message;
      });
  },
});
export const {
  setActiveTab,
  addDocument,
  removeDocument,
  addPayment,
  removePayment,
  addInvoice,
  removeInvoice,
  addExpense,
  removeExpense,
  addTodoItem,
  removeTodoItem,
  toggleTodoItem
} = accountingSlice.actions
export default accountingSlice.reducer;
