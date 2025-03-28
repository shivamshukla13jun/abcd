import api from "@utils/axiosInterceptor";

const apiService = {
  login: async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
  },
  // customer service
  getCustomers: async () => {
    const response = await api.get("/loads/customers");
    return response.data;
  },
  getCustomer: async (id) => {
    const response = await api.get(`/loads/customers/${id}`);
    return response.data;
  },
  createCustomer: async (customerData) => {
    const response = await api.post("/loads/customers", customerData);
    return response.data;
  },
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/loads/customers/${id}`, customerData);
    return response.data;
  },
  deleteCustomer: async (id) => {
    const response = await api.delete(`/loads/customers/${id}`);
    return response.data;
  },
  // asset service
  getAssets: async () => {
    const response = await api.get("/loads/assets");
    return response.data;
  },
  getAsset: async (id) => {
    const response = await api.get(`/loads/assets/${id}`);
    return response.data;
  },
  createAsset: async (assetData) => {
    const response = await api.post("/loads/assets", assetData);
    return response.data;
  },
  updateAsset: async (id, assetData) => {
    const response = await api.put(`/loads/assets/${id}`, assetData);
    return response.data;
  },
  deleteAsset: async (id) => {
    const response = await api.delete(`/loads/assets/${id}`);
    return response.data;
  },
  // Carriers Service
  getCarriers: async () => {
    const response = await api.get("/loads/carriers");
    return response.data;
  },
  getCarrier: async (id) => {
    const response = await api.get(`/loads/carriers/${id}`);
    return response.data;
  },
  createCarrier: async (carrierData) => {
    const response = await api.post("/loads/carriers", carrierData);
    return response.data;
  },
  updateCarrier: async (id, carrierData) => {
    const response = await api.put(`/loads/carriers/${id}`, carrierData);
    return response.data;
  },
  deleteCarrier: async (id) => {
    const response = await api.delete(`/loads/carriers/${id}`);
    return response.data;
  },
  createDriver: async (driverData) => {
    const response = await api.post("/loads/drivers", driverData);
    return response.data;
  },
  getDrivers: async () => {
    const response = await api.get("/loads/drivers");
    return response.data;
  },
  getDriver: async (id) => {
    const response = await api.get(`/loads/drivers/${id}`);
    return response.data;
  },
  updateDriver: async (id, driverData) => {
    const response = await api.put(`/loads/drivers/${id}`, driverData);
    return response.data;
  },
  deleteDriver: async (id) => {
    const response = await api.delete(`/loads/drivers/${id}`);
    return response.data;
  },
  getLocations: async (type="") => {
    const response = await api.get(`/loads/locations?type=${type}`);
    return response.data;
  },
  getLocation: async (id) => {
    const response = await api.get(`/loads/locations/${id}`);
    return response.data;
  },
  createLocation: async (locationData) => {
    const response = await api.post("/loads/locations", locationData);
    return response.data;
  },
  updateLocation: async (id, locationData) => {
    const response = await api.put(`/loads/locations/${id}`, locationData);
    return response.data;
  },
  deleteLocation: async (id) => {
    const response = await api.delete(`/loads/locations/${id}`);
    return response.data;
  },

  
  // load service
  getLoads: async (status="") => {
    const response = await api.get("/loads?status="+status);
    return response.data;
  },
  getLoad: async (id) => {
    const response = await api.get(`/loads/${id}`);
    return response.data;
  },
  createLoad: async (formData) => {
    const response = await api.post("/loads", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },
  getLoadByloadNumber: async (loadNumber) => {
    const response = await api.get(`/loads/loadNumber/${loadNumber}`);
    return response.data;
  },
  updateLoad: async (id, formData) => {
    const response = await api.put(`/loads/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },
  deleteLoad: async (id) => {
    const response = await api.delete(`/loads/${id}`);
    return response.data;
  },
  // getdatabyusdotnumber
  getDataByUsdotNumber: async (usdotNumber) => {
    const response = await api.get(`/safer-service/usdot/${usdotNumber}`);
    return response.data;
  },
  // invoice service
  generateInvoice: async (invoiceData,) => {
    const response = await api.post("/invoices/generate", invoiceData);
    return response.data;
  },
  getInvoice: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  updateInvoice: async (id, invoiceData) => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },
  getInvoices: async (keys) => {
    const response = await api.get("/invoices", {params:keys});
    return response.data;
  },
  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },  
  getInvoicePdf: async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`);
    return response.data;
  },
  // genrarate carrier invoice
  generateCarrierInvoice: async (invoiceData) => {
    const response = await api.post("/carrierinvoice/generate", invoiceData);
    return response.data;
  },
  // get carrier invoice
  getCarrierInvoice: async (id) => {
    const response = await api.get(`/carrierinvoice/${id}`);
    return response.data;
  },
  // update carrier invoice
  updateCarrierInvoice: async (id, invoiceData) => {
    const response = await api.put(`/carrierinvoice/${id}`, invoiceData);
    return response.data;
  },
  // get carrier invoices
  getCarrierInvoices: async (keys) => {
    const response = await api.get("/carrierinvoice", {params:keys});
    return response.data;
  },
  // delete carrier invoice
  deleteCarrierInvoice: async (id) => {
    const response = await api.delete(`/carrierinvoice/${id}`);
    return response.data;
  },
  // get carrier invoice pdf
  getCarrierInvoicePdf: async (id) => {
    const response = await api.get(`/carrierinvoice/${id}/pdf`);
    return response.data;
  }
  ,
  getPaymentTerms: async () => {
    const response = await api.get("/payment-terms");
    return response.data;
  },
  createPaymentTerm: async (paymentTermData) => {
    const response = await api.post("/payment-terms", paymentTermData);
    return response.data;
  },
  updatePaymentTerm: async (id, paymentTermData) => {
    const response = await api.put(`/payment-terms/${id}`, paymentTermData);
    return response.data;
  },
  deletePaymentTerm: async (id) => {
    const response = await api.delete(`/payment-terms/${id}`);
    return response.data;
  },
  getPaymentTerms: async () => {
    const response = await api.get("/payment-terms");
    return response.data;
  },
  getPaymentTermById: async (id) => {
    const response = await api.get(`/payment-terms/${id}`);
    return response.data;
  },
  //  Item Services APIs
createItemService: async (paymentTermData) => {
  const response = await api.post("/itemservices", paymentTermData);
  return response.data;
},
updateItemService: async (id, paymentTermData) => {
  const response = await api.put(`/itemservices/${id}`, paymentTermData);
  return response.data;
},
deleteItemService: async (id) => {
  const response = await api.delete(`/itemservices/${id}`);
  return response.data;
},
getItemServices: async () => {
  const response = await api.get("/itemservices");
  return response.data;
},
getPaymentTermById: async (id) => {
  const response = await api.get(`/itemservices/${id}`);
  return response.data;
},
getTaxOptions: async () => {
  const response = await api.get("/tax-options");
  return response.data;
}

};

export default apiService;
