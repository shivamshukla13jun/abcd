// Delivery.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addDeliveryLocation, 
  removeDeliveryLocation, 
  updateDeliveryLocation
} from "@redux/Slice/EditloadSlice";
import apiService from "@service/apiService";
import DeliveryLocation from "./DeliveryLocation";
import { IoIosAdd } from "react-icons/io";

const Delivery = () => {
  const dispatch = useDispatch();
  const { deliveryLocations } = useSelector((state) => state.editload);
  const [locations, setLocations] = useState([]);
  const initialDeliveryLocation = {
    type: "delivery",
    requirements: [],
    showDelivery: true,
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
        const response = await apiService.getLocations("delivery");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };
    fetchLocations();
  }, []);

  const addNewDeliveryLocation = (data) => {
    dispatch(addDeliveryLocation(initialDeliveryLocation));
  };
const UpdateDeliveryLocation=(index,pickup)=>{
  dispatch(updateDeliveryLocation({ index, ...pickup ,showpickupForm:true}));
}

  const removeDelivery = (index) => {
    if (deliveryLocations.length > 1) {
      dispatch(removeDeliveryLocation(index));
    }
  };
//console.log("deliveryLocations",deliveryLocations)
  return (
    <>
      <h6 className="section-title mb-3">Delivery Information</h6>

      {deliveryLocations.map((pickup, index) => (
        <DeliveryLocation
          key={index}
          index={index}
          pickup={pickup}
          onRemove={deliveryLocations.length > 1 ? removeDelivery : null}
          initialDeliveryLocation={initialDeliveryLocation}
          locations={locations}
        />
      ))}

      <div className="text-center mb-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addNewDeliveryLocation}
        >
          <IoIosAdd /> Add Another Delivery Location
        </button>
      </div>
    </>
  );
};

export default Delivery;