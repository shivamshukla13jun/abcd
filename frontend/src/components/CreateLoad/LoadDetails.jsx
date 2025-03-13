import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadDetails } from '@redux/Slice/loadSlice';
import { LoadStatus, LoadSize, EquipmentType } from '@data/Loads';

const LoadDetails = () => {
    const dispatch = useDispatch();
    const loadDetails = useSelector((state) => state.load.loadDetails);
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setLoadDetails({ ...loadDetails, [name]: value }));
    };

    return (
        <>
            <div className="form-group row mb-3">
                <div className="col-sm-3">
                    <label className="form-label">Load No</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Load No"
                        required
                        name="loadNumber"
                        value={loadDetails.loadNumber || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className='col-sm-3'>
                    <label className="form-label">Load Amout</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Load Amount"
                        required
                        name="loadAmount"
                        value={loadDetails.loadAmount || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Load Status</label>
                    <select
                        className="form-control"
                        required
                        name="status"
                        value={loadDetails.status || ''}
                        onChange={handleChange}
                    >
                        <option disabled value="">Select Status</option>
                        {LoadStatus.map((status, i) => (
                            <option key={i} value={status.name}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Commodity</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Commodity"
                        required
                        name="commodity"
                        value={loadDetails.commodity || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Load Size</label>
                    <select
                        className="form-control"
                        required
                        name="loadSize"
                        value={loadDetails.loadSize || ''}
                        onChange={handleChange}
                    >
                        <option disabled value="">Select Load Size</option>
                        {LoadSize.map((size, i) => (
                            <option key={i} value={size.id}>
                                {size.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group row mb-3">
                <div className="col-sm-3">
                    <label className="form-label">Declared Load Value</label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Value"
                            name="declaredValue"
                            value={loadDetails.declaredValue || ''}
                            onChange={handleChange}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">$</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Weight</label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Weight"
                            name="weight"
                            value={loadDetails.weight || ''}
                            onChange={handleChange}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">lbs</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Load Temperature</label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Temperature"
                            name="temperature"
                            value={loadDetails.temperature || ''}
                            onChange={handleChange}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">°F</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <label className="form-label">Equipment Type</label>
                    <select
                        className="form-control"
                        required
                        name="equipmentType"
                        value={loadDetails.equipmentType || ''}
                        onChange={handleChange}
                    >
                        <option disabled value="">Select Equipment</option>
                        {EquipmentType.map((type, i) => (
                            <optgroup key={i} label={type.category}>
                                {type.options.map((option, j) => (
                                    <option key={j} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group row mb-3">
                <div className="col-sm-3">
                    <label className="form-label">Equipment Length</label>
                    <select
                        className="form-control"
                        required
                        name="equipmentLength"
                        value={loadDetails.equipmentLength || ''}
                        onChange={handleChange}
                    >
                        <option disabled value="">Select Length</option>
                        <option value="20">20'</option>
                        <option value="28">28'</option>
                        <option value="40">40'</option>
                        <option value="45">45'</option>
                        <option value="48">48'</option>
                        <option value="53">53'</option>
                    </select>
                </div>
            </div>

            <div className="form-group row mb-3">
                <div className="col-sm-12">
                    <label className="form-label">Load Notes</label>
                    <textarea
                        className="form-control note"
                        rows={5}
                        placeholder="Enter additional details..."
                        name="notes"
                        value={loadDetails.notes || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );
};

export default LoadDetails;