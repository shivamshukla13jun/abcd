import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFiles,
  removeFile,
  setItems,
  addItem,
  setFreightCharge,
} from '@redux/Slice/EditloadSlice'; // Update the path as necessary
import "@styles/DocumentUpload.scss"
const DocumentUpload = () => {
  const dispatch = useDispatch();
  const { files, items, freightCharge } = useSelector((state) => state.editload);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedFiles = [...files, ...acceptedFiles];
      dispatch(setFiles(updatedFiles));
    },
    [files, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const addItemRow = () => {
    const newItem = {
      id: items.length + 1,
      itemDetails: '',
      description: '',
      qty: 1,
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0,
    };
    dispatch(addItem(newItem));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = {
          ...item,
          [field]: value,
        };
        updatedItem.amount =
          updatedItem.qty *
          updatedItem.rate *
          (1 - updatedItem.discount / 100) +
          updatedItem.tax;
        return updatedItem;
      }
      return item;
    });
    dispatch(setItems(newItems));
  };

  const removeItemRow = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    dispatch(setItems(newItems));
  };

  const deleteFile = (index) => {
    dispatch(removeFile(index));
  };

  return (
    <div className="container">
      <div className="card p-3 mb-4">
        <h5>Upload Document</h5>
        <div {...getRootProps({ className: 'dropzone border p-4 text-center' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Choose a file or drag & drop it here</p>
          )}
          <Button variant="primary">Browse File</Button>
        </div>
        <ul>
          {files?.map((file, index) => (
            <li key={index} className="d-flex justify-content-between align-items-center">
              {file.name || file.originalname}
              <Button variant="danger" size="sm" onClick={() => deleteFile(index)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-3 mb-4">
        <h5>Freight Charge Terms</h5>
        <div className="d-flex">
          {['Prepaid', 'Collect', '3rd Party'].map((option) => (
            <div key={option} className="custom-control custom-checkbox">
              <input
                name={option}
                id={option}
                type="checkbox"
                className="custom-control-input"
                checked={freightCharge === option}
                onChange={() => dispatch(setFreightCharge(option))}
              />
              <label htmlFor={option} className="custom-control-label">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h5>Item Details</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item Details</th>
              <th>Description</th>
              <th>QTY</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <Form.Control
                    type="text"
                    value={item.itemDetails}
                    onChange={(e) => handleItemChange(index, 'itemDetails', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value))}
                  />
                </td>
                <td>{item.amount.toFixed(2)}</td>
                <td>
                  <Button variant="danger" onClick={() => removeItemRow(index)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>

        <Button onClick={addItemRow}>Add New Row</Button>
        </div>
      </div>

      {/* <div className="card p-3 mb-4">
        <Row>
          <Col>
            <h5>Sub Total</h5>
            <p>$0.00</p>
          </Col>
          <Col>
            <h5>Total</h5>
            <p>$0.00</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Deposit</h5>
            <p>$0.00</p>
          </Col>
          <Col>
            <h5>Balance Due</h5>
            <p>$0.00</p>
          </Col>
        </Row>
      </div> */}
    </div>
  );
};

export default DocumentUpload;