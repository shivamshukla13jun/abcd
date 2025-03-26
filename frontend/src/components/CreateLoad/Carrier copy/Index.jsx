// Carier.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addCarierLocation, 
  removeCarierLocation, 
  updateCarierLocation
} from "@redux/Slice/loadSlice";
import apiService from "@service/apiService";
import { IoIosAdd } from "react-icons/io";
import Asset from "./Asset";

const Carier = () => {
  const dispatch = useDispatch();
  const { carrierIds } = useSelector((state) => state.load);
  const [locations, setLocations] = useState([]);
  const initialCarierLocation ={
    mcNumber: "",
    usdot: "",
    address: "",
    primaryContact: "",
    contactEmail: "",
    driverInfo: {
      driver1Name: "",
      driver2Name: "",
      driver1Phone: "",
      driver2Phone: "",
      driver1CDL: "",
      driver2CDL: "",
      driver1CDLExpiration: "",
      driver2CDLExpiration: "",
      powerunit: "",
      trailer: "",
    },
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

  const addNewCarierLocation = (data) => {
    dispatch(addCarierLocation());
  };
const UpdateCarierLocation=(index,pickup)=>{
  dispatch(updateCarierLocation({ index, ...pickup ,showpickupForm:true}));
}

  const removeCarier = (index) => {
    if (carrierIds.length > 1) {
      dispatch(removeCarierLocation(index));
    }
  };
console.log("carrierIds",carrierIds)
  return (
    <>
      <h6 className="section-title mb-3">Carier Information</h6>

      {carrierIds.map((pickup, index) => (
        <Asset
          index={index}
          onRemove={carrierIds.length > 1 ? removeCarier:null}
          initialCarierLocation={initialCarierLocation}
          locations={locations}
          onUpdate={(index, location) => UpdateCarierLocation(index
            , location)}
        />
      ))}

      <div className="text-center mb-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addNewCarierLocation}
        >
          <IoIosAdd /> Add Another Carier Location
        </button>
      </div>
    </>
  );
};

export default Carier;