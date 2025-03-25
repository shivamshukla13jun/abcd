import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd, IoIosTrash } from "react-icons/io";
import { setcarrierIds } from "@redux/Slice/EditloadSlice";
import apiService from "@service/apiService";
import CustomDatePicker from "@components/common/CommonDatePicker";
import { initialcarrierIds } from "@redux/InitialData/Load";
import { taransformCarrierData } from "@utils/transformData";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierIds = useSelector((state) => state.editload.carrierIds[index]);
  console.log("carrierIds",carrierIds)
  const [carriers, setCarriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch carriers from API
  const fetchCarriers = async () => {
    try {
      const response = await apiService.getCarriers();
      setCarriers(response.data);
    } catch (err) {
      console.error("Error fetching carriers:", err);
    }
  };

  const fetchCarriersByUSDOT = async (usdot) => {
    try {
      const response = await apiService.getDataByUsdotNumber(usdot);
      const transformedCarrierData = taransformCarrierData(response.data);
      dispatch(setcarrierIds({ index, asset: transformedCarrierData }));
    } catch (err) {
      console.error("Error fetching carriers by USDOT:", err);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  // Handle Carrier Selection
  const handleCarrierChange = async (e) => {
    const selectedCarrierId = e.target.value;
    
    if (selectedCarrierId && selectedCarrierId !== "") {
      try {
        const response = await apiService.getCarrier(selectedCarrierId);
        const transformedCarrierData = taransformCarrierData(response.data);
        dispatch(setcarrierIds({ index, asset: transformedCarrierData }));
      } catch (err) {
        console.error("Error fetching carrier data:", err);
      }
    } else if (selectedCarrierId === "") {
      dispatch(setcarrierIds({ index, asset: initialcarrierIds }));
    }
  };

  const handleUSDOTChange = async (e) => {
    const usdot = e.target.value;
    if (usdot) {
      await fetchCarriersByUSDOT(usdot);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Create a new object copy of carrierIds
    const updatedAsset = { ...carrierIds };
  
    if (name.startsWith('driverInfo')) {
      const [, field] = name.split('.'); // Extract the field name (e.g., driver2Name)
      // Safely clone driverInfo and update the field
      updatedAsset.driverInfo = {
        ...(updatedAsset.driverInfo || {}), // Ensure driverInfo exists
        [field]: value,
      };
    } else {
      updatedAsset[name] = value;
    }
  
    dispatch(setcarrierIds({ index, asset: updatedAsset }));
  };

  

  return (
    <div className="pickup-location-container mb-4 p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Carrier {index + 1}</h6>
        {onRemove && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(index)}
          >
            <IoIosTrash /> Remove
          </button>
        )}
      </div>

      {/* Carrier Selection Section */}
      <div className="form-group row">
        <div className="col-sm-12">
          <input
            type="text"
            className="form-control"
            placeholder="Search by USDOT Number"
            onChange={handleUSDOTChange}
          />
        </div>
      </div>
    
      <div className="form-group row">
        <div className="col-sm-12">
          <select 
            className="form-control" 
            onChange={handleCarrierChange} 
            value={carrierIds?._id || ""}
          >
            <option disabled value="">Select Carrier</option>
            <option value="">Create New Carrier</option>
            {carriers
              .filter((carrier) => 
                carrier.primaryContact.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((carrier) => (
                <option key={carrier._id} value={carrier._id}>
                  {carrier.companyName} - {carrier.mcNumber}
                </option>
              ))}
          </select>
         
        </div>
      </div>

      {/* Carrier Details Section */}
      <div className="form-group row">
        <div className="col-sm-3">
          <label className="form-label">MC#</label>
          <input
            type="text"
            readOnly={true}
            className="form-control"
            placeholder="MC#"
            name="mcNumber"
            value={carrierIds?.mcNumber || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">USDOT Number</label>
          <input
            type="text"
            readOnly={true}
            className="form-control"
            placeholder="USDOT Number"
            name="usdot"
            value={carrierIds?.usdot || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">Address</label>
          <input
            type="text"
            readOnly={true}
            className="form-control"
            placeholder="Address"
            name="address"
            value={carrierIds?.address || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="form-group row mt-5">
        <div className="col-sm-3">
          <label className="form-label">Primary Contact</label>
          <input
            type="text"
            readOnly={true}
            className="form-control"
            placeholder="Primary Contact"
            name="primaryContact"
            value={carrierIds?.primaryContact || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Contact Email"
            name="contactEmail"
            value={carrierIds?.contactEmail || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Driver Information Section */}
      <div className="form-group row">
        <div className="col-sm-12">
          <h6 className="section-title mb-3">Driver 1</h6>
        </div>
      </div>
      <div className="form-group row mb-4">
        <div className="col-sm-3">
          <label className="form-label">Driver 1 Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Driver 1 Name"
            name="driverInfo.driver1Name"
            value={carrierIds?.driverInfo?.driver1Name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 1 Phone</label>
          <input
            type="number"
            className="form-control"
            placeholder="Driver 1 Phone"
            name="driverInfo.driver1Phone"
            value={carrierIds?.driverInfo?.driver1Phone || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 1 CDL Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Driver 1 CDL Number"
            name="driverInfo.driver1CDL"
            value={carrierIds?.driverInfo?.driver1CDL || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 1 CDL Expiration</label>
          <CustomDatePicker
            type="date"
            className="form-control"
            name="driverInfo.driver1CDLExpiration"
            value={carrierIds?.driverInfo?.driver1CDLExpiration || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Driver 2 Information Section */}
      <div className="form-group row">
        <div className="col-sm-12">
          <h6 className="section-title mb-3">Driver 2</h6>
        </div>
      </div>
      <div className="form-group row mb-4">
        <div className="col-sm-3">
          <label className="form-label">Driver 2 Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Driver 2 Name"
            name="driverInfo.driver2Name"
            value={carrierIds?.driverInfo?.driver2Name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 2 Phone</label>
          <input
            type="number"
            className="form-control"
            placeholder="Driver 2 Phone"
            name="driverInfo.driver2Phone"
            value={carrierIds?.driverInfo?.driver2Phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 2 CDL Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Driver 2 CDL Number"
            name="driverInfo.driver2CDL"
            value={carrierIds?.driverInfo?.driver2CDL || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Driver 2 CDL Expiration</label>
          <CustomDatePicker
            type="date"
            className="form-control"
            name="driverInfo.driver2CDLExpiration"
            value={carrierIds?.driverInfo?.driver2CDLExpiration || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div className="form-group row">
        <div className="col-sm-6">
          <label className="form-label">Power Unit</label>
          <input
            type="text"
            className="form-control"
            placeholder="Power Unit"
            name="driverInfo.powerunit"
            value={carrierIds?.driverInfo?.powerunit || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">Trailer</label>
          <input
            type="text"
            className="form-control"
            placeholder="Trailer"
            name="driverInfo.trailer"
            value={carrierIds?.driverInfo?.trailer || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
};



export default Asset;