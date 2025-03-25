import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import LoadDetails from "@components/EditLoad/LoadDetails";
import CustomerInformation from "@components/EditLoad/CustomerInformation";
import Carrier from "@components/EditLoad/Carrier";
import Delivery from "@components/EditLoad/Delivery";
import Pickup from "@components/EditLoad/Pickup";
import {
  setActiveTab,
  resetLoad,
  setCustomerInformation,
  setDriverInfo,
  initializeLoadData,
  setAssetInfo,
} from "@redux/Slice/EditloadSlice";
import "@styles/CreateLoad.scss";
import apiService from "@service/apiService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { paths } from "@utils/paths";
import DocumentUpload from "@components/EditLoad/DocumentUpload";
import { tabs } from "@data/Loads";
import { validateLoadSchema } from "@schema/auth/loadSchema";
import { transformLoadData } from "@utils/transformData";

const EditLoad = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadId } = useParams();
  const [loadData, setLoadData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    activeTab,
    loadDetails,
    deletedfiles,
    customerInformation,
    pickupLocations, documentUpload,
    assetInfo,
    driverInfo,
    deliveryLocations,
    files,
    items,
    freightCharge,
  } = useSelector((state) => state.editload);
  const AllData = useSelector((state) => state.editload);

  useEffect(() => {
    if (loadId) {
      dispatch(resetLoad()); // Reset state before fetching new data
      const fetchLoadData = async () => {
        try {
          const response = await apiService.getLoad(loadId);
          const transformedData = transformLoadData(response.data);
          dispatch(initializeLoadData(transformedData)); // Update Redux state
        } catch (error) {
          console.error("Error fetching load details:", error);
          toast.error("Failed to fetch load details. Please try again later.");
        }
      };

      fetchLoadData();
    }
  }, [loadId]);
  const handleTabChange = async (nextTab) => {
    try {
      setError(null);
      const currentIndex = tabs.indexOf(activeTab);
      const tabname = tabs[currentIndex];

      await validateTabData(tabname); // Validate current tab data before switching

      dispatch(setActiveTab(nextTab));
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  const validateTabData = async (tabname) => {
    const validateData = {
      load: loadDetails,
      customer: customerInformation,
      asset: assetInfo,
      pickup: pickupLocations,
      delivery: deliveryLocations,
      document: {
        files: files,
        items: items,
        freightCharge: freightCharge
      },
    };
    await validateLoadSchema(tabname, validateData[tabname]);
  };
  const saveCarrier = async () => {
    try {
      let response = []
      const savedCarriers = await Promise.all(
        assetInfo.map(async (asset, index) => {
          let response;


          // Step 3: Save or update carrier
          if (asset._id) {
            response = await apiService.updateCarrier(asset._id, asset);
          } else {
            response = await apiService.createCarrier(asset);
          }
          dispatch(setAssetInfo({ index, asset: response.data }));

          return response.data;
        })
      );
      response = savedCarriers

      return response;
    } catch (err) {
      console.error('Error saving carrier:', err);
      throw err;
    }
  };

  

  const savePickupLocations = async () => {
    try {
      const savedLocations = [];

      for (const pickup of pickupLocations) {
        let response;
        if (pickup._id) {
          response = await apiService.updateLocation(pickup._id, pickup);
        } else {
          response = await apiService.createLocation(pickup);
        }
        savedLocations.push(response.data);
      }

      return savedLocations;
    } catch (err) {
      console.error('Error saving pickup locations:', err);
      if (err.response && err.response.status === 400) {
        throw new Error("Please fill all the required fields in pickup location");
      } else {
        throw new Error("An unexpected error occurred while saving pickup locations.");
      }
    }
  };

  const saveDeliveryLocation = async () => {
    try {
      const saveDeliveryLocation = [];
      for (const delivery of deliveryLocations) {
        let response;
        if (delivery._id) {
          response = await apiService.updateLocation(delivery._id, delivery);
        } else {
          response = await apiService.createLocation(delivery);
        }
        saveDeliveryLocation.push(response.data);
      }
      return saveDeliveryLocation;
    } catch (err) {
      console.error('Error saving delivery location:', err);
      if (err.response && err.response.status === 400) {
        throw new Error("Please fill all required fields in delivery location");
      }
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

  const saveLoad = async () => {
    try {
      const savedCarriers = await saveCarrier();
      const savedCustomer = customerInformation;
      const savedPickupLocations = await savePickupLocations();
      const savedDeliveryLocations = await saveDeliveryLocation();

      const formData = new FormData();

      // Add files
      files.forEach(file => {
        formData.append('loads', file);
      });
    console.log("deletedfiles", deletedfiles?.map((file) => file));
      // Prepare load data
      const loadData = {
        ...loadDetails,
        customerId: savedCustomer._id,
        carrierIds: savedCarriers.map((carrier) => carrier._id).join(','),
        pickupLocationId: savedPickupLocations.map((loc) => loc._id).join(','),
        deliveryLocationId: savedDeliveryLocations.map((loc) => loc._id).join(','),
        items: items,
        deletedfiles: deletedfiles?.map((file) => file) ||"",
        freightCharge: freightCharge
      };

      // Add load data to FormData
      Object.keys(loadData).forEach(key => {
        if(typeof loadData[key] === 'object'){
          formData.append(key, JSON.stringify(loadData[key]));
        }else{
          formData.append(key, loadData[key]);
        }
      });

      // Update the state initialization
      dispatch(initializeLoadData({
        loadDetails,
        customerInformation: savedCustomer,
        assetInfo: savedCarriers,
        pickupLocations: savedPickupLocations,
        deliveryLocations: savedDeliveryLocations,
        files: files,
        items: items,
        freightCharge: freightCharge,
        activeTab: "load",
        showCustomer: !!savedCustomer,
        showAsset: !!savedCarriers?.length,
        showPickup: !!savedPickupLocations?.length,
        showDelivery: !!savedDeliveryLocations?.length,
      }));

      return formData;
    } catch (err) {
      console.error('Error saving load:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
     let errorValidation= await Promise.all(tabs.map(validateTabData)); // Validate all tabs before submission
      console.log("errorValidation", errorValidation) 
     const formData = await saveLoad();

      const response = await apiService.updateLoad(loadId, formData);
      toast.success(`Load updated successfully!`);
      navigate(paths.loads);
    } catch (err) {
      console.error('Error submitting load:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to submit load.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("AllData", AllData)
  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="loadForm" onSubmit={handleSubmit}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
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
              type="button"
              className="btn btn-outline-primary ms-2 custom-button"
              onClick={handleNext}
              disabled={activeTab === "document"}
            >
              Next
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-success ms-2 custom-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditLoad;