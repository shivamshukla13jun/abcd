// DeliveryLocation.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDatePicker from "@components/common/CommonDatePicker";
import { CityDatabase, States } from "@data/cityDatabase";
import { locationClasses, locationRequirement } from "@data/Loads";
import { IoIosAdd, IoIosTrash } from "react-icons/io";
import { updateDeliveryLocation } from "@redux/Slice/EditloadSlice";

const DeliveryLocation = ({ index, pickup, onRemove,initialDeliveryLocation,locations }) => {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  useEffect(() => {
    if(pickup?.state){
      let cities=CityDatabase.filter((item)=>item.state==pickup?.state)
      setCities(cities)
    }else{
      setCities([])
    }
  },[pickup?.state])


  const handleLocationUpdate = async (e,index) => {
  
    try {
      const locationId = e.target.value;
      //console.log("locationId",locationId)
      if(!locationId){
        // add empty form in current index
        dispatch(updateDeliveryLocation({index, ...initialDeliveryLocation}))
        return;
      }
      const location = locations.find((location) => location._id == locationId);
      //console.log("location",location)
      //console.log("locations",locations)
      dispatch(updateDeliveryLocation({index, ...location}))
      // onUpdate(index, location);
      return 
  
    } catch (error) {
      console.error("Error fetching location details", error);
    }
  };

  const handleChange = (e, datePicker = false, isTimePicker = false) => {
    const name = e.target.name
    const value = e.target.value;

    const updatedDeliveryInfo = { ...pickup, [name]: value };
    dispatch(updateDeliveryLocation({index,...updatedDeliveryInfo}))
     if(name=="state"){
         let cities=CityDatabase.filter((item)=>item.state==value)
         setCities(cities)
        }
  };


  const handleRequirementChange = (requirementName) => {
    const currentRequirements = new Set(pickup.requirements || []);

    if (currentRequirements.has(requirementName)) {
      currentRequirements.delete(requirementName);
    } else {
      currentRequirements.add(requirementName);
    }

    const updatedDeliveryInfo = {
      ...pickup,
      requirements: Array.from(currentRequirements)
    };
    dispatch(updateDeliveryLocation({index,...updatedDeliveryInfo}))
  };
//console.log("fetch locations",locations)
  return (
    <div className="pickup-location-container mb-4 p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Delivery Location {index + 1}</h6>
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
      <div className="form-group row">
        <div className="col-sm-12">
          <select
            className="form-control"
            name="id"
            value={pickup._id || ""}
            onChange={(event)=>handleLocationUpdate(event,index)}
          >
            <option disabled value="">
              Location Name *
            </option>
            <option  value="">
              Create New Delivery Location
            </option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {"location " + location.address}
              </option>
            ))}
          </select>
          <p onClick={()=>  dispatch(updateDeliveryLocation({index,...initialDeliveryLocation}))} className="create-link">
            <IoIosAdd /> Click here to create a new Delivery location.
          </p>
        </div>
      </div>
      <div className="form-group row mt-2">
        <div className="col-sm-6">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            name="address"
            value={pickup.address || ""}
            onChange={(e) => handleChange(e, index)}
            required
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">State</label>
          <select
            className="form-control"
            name="state"
            value={pickup.state || ""}
            onChange={(e) => handleChange(e, index)}
          >
            <option disabled value="">Select State</option>
            {States.map((state, i) => (
              <option key={i} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-3">
          <label className="form-label">City</label>
          <select
            className="form-control"
            name="city"
            value={pickup.city || ""}
            onChange={(e) => handleChange(e, index)}
          >
            <option disabled value="">Select City</option>
            {cities.map((city, i) => (
              <option key={i} value={city.city}>{city.city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group row mt-2">
        <div className="col-sm-3">
          <label className="form-label">Zipcode</label>
          <input
            className="form-control"
            name="zipcode"
            value={pickup.zipcode || ""}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label">Location Class</label>
          <select
            className="form-control"
            name="locationClass"
            value={pickup.locationClass || ""}
            onChange={(e) => handleChange(e, index)}
          >
            <option disabled value="">Location Class</option>
            {locationClasses.map((locationClass) => (
              <option key={locationClass} value={locationClass}>{locationClass}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-3">
          <label className="form-label d-flex">Date</label>
          <CustomDatePicker
            className="form-control"
            name="date"
            value={pickup.date || ""}
            onChange={(e) => handleChange(e, true, false)}
            required
          />
        </div>
        <div className="col-sm-3">
          <label className="form-label d-flex">Time</label>
          <CustomDatePicker
            isTimePicker={true}
            className="form-control"
            name="time"
            value={pickup.time || ""}
            onChange={(e) => handleChange(e, false, true)}
            required
          />
        </div>
      </div>

      <div className="form-group row mb-3">
        <div className="col-sm-12">
          <label className="form-label">Driver Instructions</label>
          <textarea
            className="form-control note"
            rows={5}
            placeholder="Enter additional details..."
            name="notes"
            value={pickup.notes || ''}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      </div>

      <div className="form-group row mt-5">
        <div className="col-sm-12">
          <div className="checkbox-group">
            <label>Location Requirements</label>
            {locationRequirement.map((requirement) => (
              <div key={requirement._id} className="custom-control custom-checkbox">
                <input
                  name={requirement.name}
                  type="checkbox"
                  className="custom-control-input"
                  checked={pickup.requirements?.includes(requirement.name) || false}
                  onChange={() => handleRequirementChange(requirement.name, index)}
                />
                <label
                  className="custom-control-label"
                >
                  {requirement.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>

  );
};

export default DeliveryLocation;