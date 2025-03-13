import React, { use, useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerInformation, toggleCustomerVisibility } from '@redux/Slice/EditloadSlice';
import apiService from '@service/apiService';

const CustomerInformation = () => {
  const dispatch = useDispatch();
  const { customerInformation, showCustomer } = useSelector((state) => state.editload);
  const [customers,setCustomers]=useState([])
  // Get All Customers
  const fetchCustomers = async () => {
    try {
      const response = await apiService.getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

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
      dispatch(setCustomerInformation({}));
      dispatch(toggleCustomerVisibility(true));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCustomerInformation({
      ...customerInformation,
      [name]: value,
    }));
  };

  const handleShow = () => {
    dispatch(setCustomerInformation({}));
    dispatch(toggleCustomerVisibility());
  };
  return (
    <>
    <div className="form-group row">
          <div className="col-sm-12">
            <h6 className="section-title mb-3">Customer</h6>
            <select 
              className="form-control" 
              onChange={handleCustomerChange}
              value={customerInformation._id || ''}
            >
              <option disabled value="">Select Customer</option>
              {/* <option value="">Create New Customer</option> */}
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>{customer.customerName}</option>
              ))}
              {/* This would ideally be populated from an API */}
            </select>
            {/* <p   onClick={handleShow} className="create-link">
              <IoIosAdd /> Click here to create a new customer to add to this load.
            </p> */}
          </div>
        </div>
  <div className="form-group row">
  <div className="col-sm-3">
      <label className="form-label">Company Name</label>
      <input
        type="text"
        className="form-control"
        name="company"
        readOnly={true}
        value={customerInformation.company || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="customerName" className="form-label">Contact Name</label>
      <input
        type="text"
        className="form-control"
        name="customerName"
        readOnly={true}
        id="customerName"
        value={customerInformation.customerName || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="email" className="form-label">Contact Email</label>
      <input
        type="email"
        readOnly={true}
        className="form-control"
        name="email"
        id="email"
        value={customerInformation.email || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="phone" className="form-label">Contact Phone</label>
      <input
        type="text"
        readOnly={true}
        className="form-control"
        name="phone"
        id="phone"
        value={customerInformation.phone || ''}
        onChange={handleChange}
      />
    </div>
  
  </div>

  <div className="form-group row">

    <div className="col-sm-3">
      <label htmlFor="fax" className="form-label">Contact Fax</label>
      <input
        type="text"
        readOnly={true}
        className="form-control"
        name="fax"
        id="fax"
        value={customerInformation.fax || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-6">
      <label htmlFor="address" className="form-label">Address</label>
      <textarea
        className="form-control"
        name="address"
        readOnly={true}
        id="address"
        rows={3}
        value={customerInformation.address || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="reference" className="form-label">Customer Reference #</label>
      <input
        type="tel"
        className="form-control"
        name="reference"
        readOnly={true}
        id="reference"
        value={customerInformation.reference || ''}
        onChange={handleChange}
      />
    </div>
  </div>

  <div className="form-group row">
  <div className="col-sm-3">
      <label htmlFor="ext" className="form-label">Contact Ext</label>
      <input
        type="text"
        className="form-control"
        name="ext"
        readOnly={true}
        id="ext"
        value={customerInformation.ext || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="mcNumber" className="form-label">MC Number</label>
      <input
        type="text"
        readOnly={true}
        className="form-control"
        name="mcNumber"
        id="mcNumber"
        value={customerInformation.mcNumber || ''}
        onChange={handleChange}
      />
    </div>
    <div className="col-sm-3">
      <label htmlFor="usdot" className="form-label">USDOT Number</label>
      <input
        type="text"
        readOnly={true}
        className="form-control"
        name="usdot"
        id="usdot"
        value={customerInformation.usdot || ''}
        onChange={handleChange}
      />
    </div>
  
  </div>
</>
  );
};

export default CustomerInformation;