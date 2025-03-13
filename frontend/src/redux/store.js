import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import sidebarReducer from "./Slice/sidebarSlice";
import loadSliceReducer from "./Slice/loadSlice";
import editloadSliceReducer from "./Slice/EditloadSlice";
import toastReducer from "./Slice/toastSlice";
import userReducer from "./Slice/UserSlice";
import accountingReducer from "./Slice/accountingSlice";
// import { apiSlice } from "./api/apiSlice"; // RTK Query API Slice
import invoiceReducer from './Slice/invoiceSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['invoice']
};

const persistedInvoiceReducer = persistReducer(persistConfig, invoiceReducer);

const LoadpersistConfig = {
  key: "load",
  storage,
  // whitelist: ["load"], // Persist only load state
};
const AuthpersistConfig = {
  key: "auth",
  storage,
  // whitelist: ["load"], // Persist only load state
};

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    load: persistReducer(LoadpersistConfig, loadSliceReducer),
    toast: toastReducer,
    invoice: persistedInvoiceReducer,

    editload: editloadSliceReducer,
    user: persistReducer(AuthpersistConfig,userReducer), // Add the userLogin reducer to the store
    // accounting: accountingReducer, // Add accounting reducer
    // [apiSlice.reducerPath]: apiSlice.reducer, // Integrate RTK Query API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Allow non-serializable values
    }), // ✅ Add RTK Query middleware
});

export const persistor = persistStore(store);
export default store;
