import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import LoadDetails from "@components/CreateLoad/LoadDetails";
import CustomerInformation from "@components/CreateLoad/CustomerInformation";
import Carrier from "@components/CreateLoad/Carrier";
import Delivery from "@components/CreateLoad/Delivery";
import { setActiveTab, resetLoad, setcarrierIds, setCustomerInformation, updatePickupLocation, updateDeliveryLocation, setLoadId } from "@redux/Slice/loadSlice";
import '@styles/CreateLoad.scss';
import apiService from "@service/apiService";
import { toast } from "react-toastify";
import Pickup from "@components/CreateLoad/Pickup";
import { useNavigate } from "react-router-dom";
import { paths } from "@utils/paths";
import DocumentUpload from "@components/CreateLoad/DocumentUpload";
import { tabsSchema, validateLoadSchema } from "@schema/auth/loadSchema";
import { tabs } from "@data/Loads";

const CreateLoad = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    activeTab, 
    loadDetails, 
    customerInformation, 
    pickupLocations, customerExpense,
    carrierIds,
     id,
    deliveryLocations,
    files,
    items,customerRate,
    freightCharge
  } = useSelector((state) => state.load);
  const loadData = useSelector((state) => state.load);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  console.log("loadData",loadData)
  const validateTabData = async (tabname) => {
    const validateData = {
        load: loadDetails,
        customer: {...customerInformation,customerExpense:customerExpense},
        asset: carrierIds,
        pickup: pickupLocations,
        delivery: deliveryLocations,
        document:{
          files: files,
        // items: items,
        // freightCharge: freightCharge
        }
        
    };
    return await validateLoadSchema(tabname, validateData[tabname]);
};


  const savePickupLocations = async () => {
    try {
      const savedLocations = [];
      for (const [index, pickup] of pickupLocations.entries()) {
        let response;
        if (pickup._id) {
          response = await apiService.updateLocation(pickup._id, pickup);
        } else {
          response = await apiService.createLocation(pickup);
        }
        // Update Redux store with server response
        dispatch(updatePickupLocation({
          index,
          ...response.data
        }));
        savedLocations.push(response.data);
      }
      return savedLocations;
    } catch (err) {
      console.error('Error saving pickup locations:', err);
      throw err;
    }
  };

  const saveDeliveryLocation = async () => {
    try {
      const saveDeliveryLocation = [];
      for (const [index, delivery] of deliveryLocations.entries()) {
        let response;
        if (delivery._id) {
          response = await apiService.updateLocation(delivery._id, delivery);
        } else {
          response = await apiService.createLocation(delivery);
        }
        // Update Redux store with server response
        dispatch(updateDeliveryLocation({
          index,
          ...response.data
        }));
        saveDeliveryLocation.push(response.data);
      }
      return saveDeliveryLocation;
    } catch (err) {
      console.error('Error saving delivery location:', err);
      throw err;
    }
  };

  const handleNext = async () => {
    try {
        setError(null);
        const currentIndex = tabs.indexOf(activeTab);

        if (currentIndex < tabs.length - 1) {
            const tabname = tabs[currentIndex];
            await validateTabData(tabname); // Validate current tab data
            dispatch(setActiveTab(tabs[currentIndex + 1]));
        }
    } catch (error) {

        toast.error(error.message);
        setError(error.message);
    }
};

  
  
  const handlePrevious = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      dispatch(setActiveTab(tabs[currentIndex - 1]));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
        await Promise.all(tabs.map(validateTabData));
        const pickupResponses = await savePickupLocations();
        const deliveryResponses = await saveDeliveryLocation();
        const formData = new FormData();

        // Add files
        files.forEach(file => {
          formData.append('loads', file);
        });
       console.log("carr")
        // Prepare load data
        console.log("carrierIds",carrierIds)
        console.log("all")
       
        const loadData = {
          ...loadDetails,
          customerExpense,customerRate:customerRate || 0,
          customerId: customerInformation._id,
          carrierIds: carrierIds,
          pickupLocationId: pickupResponses.map((loc) => loc._id).join(','),
          deliveryLocationId: deliveryResponses.map((loc) => loc._id).join(','),
          // items: items,
          // freightCharge: freightCharge
        };

        // Add load data to FormData
        Object.keys(loadData).forEach(key => {
          if(typeof loadData[key] === 'object'){
            formData.append(key, JSON.stringify(loadData[key]));
          }else{
            formData.append(key, loadData[key]);
          }
        });

        const response = id
          ? await apiService.updateLoad(id, formData)
          : await apiService.createLoad(formData);

        setSuccess(`Load ${id ? 'updated' : 'created'} successfully!`);
        dispatch(setLoadId(response.data._id));
        toast.success(`Load ${id ? 'updated' : 'created'} successfully!`);
        setTimeout(()=> {
          setIsSubmitting(false);
          navigate(paths.loads)
        },1000)
        
    } catch (err) {
      setIsSubmitting(false);
        const errorMsg = err?.response?.data?.message || err.message || 'Failed to submit load.';
        toast.error(errorMsg);
        setError(errorMsg);
        console.error('Error submitting load:', err);
    } 
};
const handleTabChange = async (nextTab) => {
  try {
    setError(null);

    // Validate next tab before switching
    // const isNextTabValid = await validateTabData(nextTab);
    //  console.log("isNextTabValid",isNextTabValid)
    // if (isNextTabValid) {
    //   dispatch(setActiveTab(nextTab));
    // } else {
    //   toast.error("Next tab has validation errors.");
    // }
    dispatch(setActiveTab(nextTab));

  } catch (error) {
    toast.error(error.message);
    setError(error.message);
  }
};

console.log("loadData",loadData)
  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="loadForm" onSubmit={handleSubmit}>
        {/* Navigation Tabs */}
        <Tab.Container  activeKey={activeTab} onSelect={(k) => handleTabChange(k)}>
          <Nav variant="tabs" className="mb-4 tabs-styling">
            <Nav.Item>
              <Nav.Link eventKey="load" className="nav-link-custom">Load Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="customer" className="nav-link-custom">Customer Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="asset" className="nav-link-custom">Carrier/Asset Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pickup" className="nav-link-custom">Pickup Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="delivery" className="nav-link-custom">Delivery Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="document" className="nav-link-custom">Upload Document</Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Tab Content */}
            <Tab.Content>
            {tabs.map((tab, index) => (
              <Tab.Pane key={index} eventKey={tab}>
                {tab === "load" && activeTab == "load" && <div className="tab-content-wrapper">
                  <LoadDetails />
                </div>}
                {tab === "customer" && activeTab == "customer" &&   <div className="tab-content-wrapper">
                  <CustomerInformation />
                </div>}
                {tab === "asset" && activeTab == "asset" && <div className="tab-content-wrapper">
                 <Carrier />
                 </div>}
                {tab === "pickup" && activeTab == "pickup" &&<div className="tab-content-wrapper">
                  <Pickup />
                </div>}
                {tab === "delivery" && activeTab == "delivery" && <div className="tab-content-wrapper">
                  <Delivery />
                </div>}
                {tab === "document" && activeTab == "document" &&  <div className="tab-content-wrapper">
                  <DocumentUpload />
                </div>}
              </Tab.Pane>
            ))}
            </Tab.Content>
        </Tab.Container>

        <hr />
        <div className="row action-buttons">
          <div className="col-lg-6">
            <button
              type="button"
              className="btn btn-outline-danger custom-button"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                  dispatch(resetLoad());
                }
              }}
            >
              Cancel
            </button>
          </div>
          <div className="col-lg-6 text-end">
            <button
              type="button"
              className="btn btn-outline-secondary custom-button"
              onClick={handlePrevious}
              disabled={activeTab === "load"}
            >
              Previous
            </button>
            <button
              type={activeTab === "document"?"submit":"button"}
              className="btn btn-outline-primary ms-2 custom-button"
              onClick={activeTab === "document"?handleSubmit:handleNext}
              // disabled={activeTab === "document"}
              disabled={isSubmitting}
            >
              {
                activeTab === "document"? "Save":isSubmitting?"Saving...":"Next"
              }
            </button>
            {/* <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-success ms-2 custom-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLoad;