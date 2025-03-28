import React, { useState, useEffect } from 'react';
import { Button, Container, Nav, Table, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiService from "@service/apiService";
import { toast } from "react-toastify";
import { formatDate } from '@utils/formatDate';
import { Modal, Box, Typography } from '@mui/material';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { resetLoad } from '@redux/Slice/EditloadSlice';

import './ViewLoad.scss';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
};
const LOAD_STATUSES = [
  { key: 'allLoad', label: 'All Loads' },
  { key: 'Pending', label: 'Pending' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Dispatched', label: 'Dispatched' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Cancelled' }
];

const ViewLoad = () => {
  const [activeTab, setActiveTab] = useState('allLoad');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loads, setLoads] = useState([]);
  const [invoiceType, setInvoiceType] = useState('customer');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const status = activeTab === 'allLoad' ? '' : activeTab;
        const response = await apiService.getLoads(status);
        setLoads(response.data);
      } catch (error) {
        console.error('Error fetching loads:', error);
        toast.error('Failed to fetch loads. Please try again later.');
      }
    };

    fetchLoads();
  }, [activeTab]);

  const getStatusClass = (status) => {
    const baseClass = 'view-load__status';
    switch (status) {
      case 'Pending':
        return `${baseClass} ${baseClass}--pending`;
      case 'Delivered':
        return `${baseClass} ${baseClass}--delivered`;
      case 'Cancelled':
        return `${baseClass} ${baseClass}--cancelled`;
      case 'Active':
        return `${baseClass} ${baseClass}--active`;
      case 'In Progress':
        return `${baseClass} ${baseClass}--in-transit`;
      case 'To Be Billed':
        return `${baseClass} ${baseClass}--to-be-billed`;
      case 'Dispatched':
        return `${baseClass} ${baseClass}--dispatched`;
      default:
        return baseClass;
    }
  };

  const handleEdit = (loadId) => {
    dispatch(resetLoad());
    navigate(`/editload/${loadId}`);
  };

  const handleCreateLoad = () => {
    // dispatch(resetnewLoad());
    navigate("/createload");
  };
  const handleCreateInvoice = async (data) => {
    try {
      console.log("create invlice",data)
      await apiService.generateInvoice(data);
      toast.success('Invoice created successfully');
      setShowInvoiceModal(false);
    } catch (error) {
      toast.error('Failed to create invoice');
      toast.error(error.message);
    }
  };

  const handleEditInvoice = async (data) => {
    try {
      console.log("edit invlice",{data,editingInvoice:editingInvoice})
      await apiService.updateInvoice(editingInvoice._id, data);
      toast.success('Invoice updated successfully');
      setShowInvoiceModal(false);
    } catch (error) {
      console.log("error",error)
      // toast.error('Failed to update invoice');
      toast.error(error.message);
    }
  };
  const handleCloseModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleInvoiceClick = (type, load) => {
    setInvoiceType(type);
    if (load.invoice && type === 'customer') {
      setEditingInvoice({...load.invoice, loadNumber: load.loadNumber});
    } else {
      setEditingInvoice({ loadNumber: load.loadNumber,carrierId:load.carrierIds.map(({carrier})=>carrier._id), invoiceNumber: load.loadNumber });
    }
    setShowInvoiceModal(true);
  };
  
  const LoadTable = ({ data }) => (
    <div className="view-load__table-wrapper">
      <Table>
        <thead>
          <tr>
            <th>Load No</th>
            <th>Status</th>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Picks</th>
            <th>Pick Date</th>
            <th>Drops</th>
            <th>Drop Date</th>
            <th>Carrier</th>
            <th>Driver</th>
            <th>Equipment</th>
            <th>Power Unit</th>
            <th>Trailer</th>
            <th>Created By</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((load) => (
              <tr key={load._id}>
                <td>{load.loadNumber || "-"}</td>
                <td>
                  <span className={getStatusClass(load?.status)}>
                    {load?.status}
                  </span>
                </td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip>
                        Select invoice type
                      </Tooltip>
                    }
                  >
                    <DropdownButton
                      variant="link"
                      title={load.invoice ? "Edit Invoice" : "Create Invoice"}
                      className="view-load__action-btn"
                    >
                      <Dropdown.Item onClick={() => handleInvoiceClick('customer', load)}>
                        Customer Invoice
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleInvoiceClick('carrier', load)}>
                        Carrier Invoice
                      </Dropdown.Item>
                    </DropdownButton>
                  </OverlayTrigger>
                </td>
                <td>{load.customerId?.customerName || "-"}</td>
                <td>
                  {load.pickupLocationId?.length > 0 ? (
                    <ul className="data-list">
                      {load.pickupLocationId.map((loc, index) => (
                        <li key={`${loc._id}-${index}`}>
                          {loc.address || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.pickupLocationId?.length > 0 ? (
                    <ul className="data-list">
                      {load.pickupLocationId.map((loc, index) => (
                        <li key={`${loc._id}-${index}`}>
                          {formatDate(loc.date) || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.deliveryLocationId?.length > 0 ? (
                    <ul className="data-list">
                      {load.deliveryLocationId.map((loc, index) => (
                        <li key={`${loc._id}-${index}`}>
                          {loc.address || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.deliveryLocationId?.length > 0 ? (
                    <ul className="data-list">
                      {load.deliveryLocationId.map((loc, index) => (
                        <li key={`${loc._id}-${index}`}>
                          {formatDate(loc.date) || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="data-list">
                      {load.carrierIds.map(({carrier}, index) => (
                        <li key={`${carrier._id}-${index}`}>
                          {carrier.primaryContact || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                {load.carrierIds?.length > 0 ? (
  <ul className="data-list">
    {load.carrierIds
      .flatMap(({ assignDrivers }) => assignDrivers || []) // Flatten correctly
      .map((driver, index) => (
        <li key={index}>{driver.driverName}</li> // Access `driverName` correctly
      ))}
  </ul>
) : "-"}

                </td>
                <td>{load.equipmentType || "-"}</td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="data-list">
                      {load.carrierIds.map((carrier, index) => (
                        <li key={`${carrier._id}-${index}`}>
                          {carrier?.driverInfo?.powerunit || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="data-list">
                      {load.carrierIds.map((carrier, index) => (
                        <li key={`${carrier._id}-${index}`}>
                          {carrier?.driverInfo?.trailer || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>{load.userId?.name || "-"}</td>
                <td className="text-center">
                  <Button
                    variant="link"
                    className="view-load__action-btn"
                    onClick={() => handleEdit(load._id)}
                  >
                    <FaPencilAlt />
                  </Button>
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="view-load__empty">
                No loads found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  return (
    <>
    
    <div className="view-load">
      <Container fluid className="view-load__container">
        <div className="view-load__header">
          <h2>View Loads</h2>
          <Button className="view-load__create-btn" onClick={handleCreateLoad}>
            <IoIosAdd />
            Create New Load
          </Button>
        </div>

        <Nav variant="tabs" className="view-load__tabs" activeKey={activeTab} onSelect={setActiveTab}>
          {LOAD_STATUSES.map(status => (
            <Nav.Item key={status.key}>
              <Nav.Link eventKey={status.key}>{status.label}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <LoadTable data={loads} />
      </Container>
    </div>
    
    <Modal 
        open={showInvoiceModal}
        onClose={handleCloseModal}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {editingInvoice ? `${editingInvoice?._id?"Edit":"Create"} ${invoiceType === 'customer' ? 'Customer' : 'Carrier'} Invoice` : 
             `${editingInvoice?._id?"Edit":"Create New"}  ${invoiceType === 'customer' ? 'Customer' : 'Carrier'} Invoice`}
          </Typography>
          <InvoiceForm
            onSubmit={editingInvoice?._id ? handleEditInvoice : handleCreateInvoice}
            initialData={editingInvoice}
            invoiceType={invoiceType}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ViewLoad;
