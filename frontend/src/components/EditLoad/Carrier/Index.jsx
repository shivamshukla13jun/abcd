// Carier.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addCarierLocation, 
  removeCarierLocation, 
} from "@redux/Slice/EditloadSlice";

import Asset from "./Asset";

const Carier = () => {
  const dispatch = useDispatch();
  const { carrierIds } = useSelector((state) => state.editload);
  const addNewCarierLocation = (data) => {
    dispatch(addCarierLocation());
  };

  const removeCarier = (index) => {
    if (carrierIds.length > 1) {
      dispatch(removeCarierLocation(index));
    }
  };
  return (
    <>
      <h6 className="section-title mb-3">Carier Information</h6>

      {carrierIds.map((pickup, index) => (
        <Asset
          index={index}
          onRemove={carrierIds.length > 1 ? removeCarier:null}
       
        />
      ))}

      {/* <div className="text-center mb-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addNewCarierLocation}
        >
          <IoIosAdd /> Add Another Carier Location
        </button>
      </div> */}
    </>
  );
};

export default Carier;