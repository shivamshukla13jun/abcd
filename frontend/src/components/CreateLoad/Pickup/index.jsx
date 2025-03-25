// Pickup.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addPickupLocation, 
  removePickupLocation, 
  updatePickupLocation
} from "@redux/Slice/loadSlice";
import apiService from "@service/apiService";
import PickupLocation from "./PickupLocation";
import { IoIosAdd } from "react-icons/io";

const Pickup = () => {
  const dispatch = useDispatch();
  const { pickupLocations } = useSelector((state) => state.load);
  const [locations, setLocations] = useState([]);
  const initialPickupLocation = {
    type: "pickup",
    requirements: [],
    showPickup: true,
    address: "",
    state: "",
    city: "",
    zipcode: "",
    locationClass: "",
    date: "",
    time: "",
    notes: "",
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await apiService.getLocations("pickup");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };
    fetchLocations();
  }, []);

  const addNewPickupLocation = (data) => {
    dispatch(addPickupLocation(initialPickupLocation));
  };

  const removePickup = (index) => {
    if (pickupLocations.length > 1) {
      dispatch(removePickupLocation(index));
    }
  };
//console.log("pickupLocations",pickupLocations)
  return (
    <>
      <h6 className="section-title mb-3">Pickup Information</h6>

      {pickupLocations.map((pickup, index) => (
        <PickupLocation
        key={pickup._id || index} // Add unique key

          index={index}
          pickup={pickup}
          onRemove={pickupLocations.length > 1 ? removePickup : null}
          initialPickupLocation={initialPickupLocation}
          locations={locations}
        />
      ))}

      <div className="text-center mb-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addNewPickupLocation}
        >
          <IoIosAdd /> Add Another Pickup Location
        </button>
      </div>
    </>
  );
};

export default Pickup;