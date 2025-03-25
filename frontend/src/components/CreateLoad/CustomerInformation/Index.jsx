import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerInformation, toggleCustomerVisibility } from '@redux/Slice/loadSlice';
import apiService from '@service/apiService';
import AddCustomer from '@/components/Customers/AddCustomer';

const CustomerInformation = () => {
  const dispatch = useDispatch();
  const { customerInformation, } = useSelector((state) => state.load);
  const [customers,setCustomers]=useState([])
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  // Get All Customers
  const fetchCustomers = async () => {
    try {
      const response = await apiService.getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };
 

  const handleCustomerChange = async (e) => {
    const selectedCustomerId = e.target.value;
    
    if (selectedCustomerId && selectedCustomerId !== '') {
      try {
        const response = await apiService.getCustomer(selectedCustomerId);
        dispatch(setCustomerInformation(response.data));
        dispatch(toggleCustomerVisibility(true));
      } catch (err) {
        console.error('Error fetching customer data:', err);
      }
    } else if (selectedCustomerId === '') {
      // Reset and open form for new customer
      setShowCustomerForm(true);
        
    }
  };



  useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <>
      <div className="form-group row">
        <div className="col-sm-12">
          <h6 className="section-title mb-3">Customer</h6>
          <select className="form-control" onChange={handleCustomerChange} value={customerInformation._id || ""}>
            <option disabled value="">
              { "Select Customer"}
            </option>
            <option value="">Create New Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.customerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer Details */}
      <div className="form-group row">
        {[
          { label: "Company Name", name: "company" },
          { label: "Contact Name", name: "customerName" },
          { label: "Contact Email", name: "email", type: "email" },
          { label: "Contact Phone", name: "phone" },
          { label: "Address", name: "address", type: "textarea" },
          { label: "MC Number", name: "mcNumber" },
          { label: "USDOT Number", name: "usdot" },
          { label: "UTR Number", name: "utrNumber" },
        ].map(({ label, name, type }) => (
          <div key={name} className={`col-sm-${type === "textarea" ? 6 : 3}`}>
            <label className="form-label">{label}</label>
            {type === "textarea" ? (
              <textarea className="form-control" name={name} readOnly value={customerInformation[name] || ""} rows={3} />
            ) : (
              <input className="form-control" name={name} type={type || "text"} readOnly value={customerInformation[name] || ""} />
            )}
          </div>
        ))}
      </div>

      {showCustomerForm && (
        <AddCustomer
          open={showCustomerForm}
          onClose={() => setShowCustomerForm(false)}
          onSuccess={() => {
            setShowCustomerForm(false);
            fetchCustomers();
          }}
        />
      )}
    </>
  );
};

export default CustomerInformation;