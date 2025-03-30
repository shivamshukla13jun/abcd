import React, { useState, useEffect } from 'react';
import { Button, Container, Nav, Table, Dropdown, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiService from "@service/apiService";
import { toast } from "react-toastify";
import { formatDate } from '@utils/formatDate';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import CarrierInvoiceForm from '@/components/CarrierInvoice/CarrierInvoiceForm';
import CustomerInvoiceForm from '@/components/CustomerInvoice/CustomerInvoiseForm';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { resetLoad } from '@redux/Slice/EditloadSlice';
import { setFormData, setLoadNumber } from '@redux/Slice/invoiceSlice';

import './ViewLoad.scss';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: '8px',
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
        toast.error('Failed to fetch loads');
      }
    };

    fetchLoads();
  }, [activeTab]);

  const handleCreateLoad = () => {
    navigate("/createload");
  };

  const handleCreateInvoice = async (data) => {
    try {
      if(invoiceType === 'customer') {
        await apiService.generateInvoice(data);
      } else {
        await apiService.generateCarrierInvoice(data);
      }
      toast.success('Invoice created successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
    }
  };

  const handleEditInvoice = async (data) => {
    try {
      if(invoiceType === 'customer') {
        await apiService.updateInvoice(editingInvoice._id, data);
      } else {
        await apiService.updateCarrierInvoice(editingInvoice._id, data);
      }
      toast.success('Invoice updated successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to update invoice');
    }
  };

  const handleCloseModal = () => {
    setShowInvoiceModal(false);
    setEditingInvoice(null);
    dispatch(setFormData({}));
    dispatch(setLoadNumber(''));
  };

  const handleInvoiceClick = (type, load) => {
    setInvoiceType(type);
    dispatch(setLoadNumber(load.loadNumber));

    if (type === 'customer' && load.invoice) {
      setEditingInvoice({ ...load.invoice, loadNumber: load.loadNumber });
    } else if (type === 'carrier' && load.carrierinvoices) {
      setEditingInvoice({
        ...load.carrierinvoices,
        loadNumber: load.loadNumber,
        carrierId: load.carrierIds.map(({carrier}) => carrier._id),
        invoiceNumber: load.loadNumber
      });
    } else {
      setEditingInvoice({ loadNumber: load.loadNumber });
    }
    setShowInvoiceModal(true);
  };

  const handleEdit = (loadId) => {
    dispatch(resetLoad());
    navigate(`/editload/${loadId}`);
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
          {data?.length > 0 ? (
            data.map((load) => (
              <tr key={load._id}>
                <td>{load.loadNumber || "-"}</td>
                <td>
                  <span className={`view-load__status view-load__status--${load.status?.toLowerCase()}`}>
                    {load.status}
                  </span>
                </td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Select invoice type</Tooltip>}
                  >
                    <DropdownButton
                      variant="link"
                      title={(load.invoice || load.carrierinvoices) ? "Edit Invoice" : "Create Invoice"}
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
                  <ul className="data-list">
                    {load.pickupLocationId?.map((loc, index) => (
                      <li key={`${loc._id}-${index}`}>{loc.address || "-"}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load.pickupLocationId?.map((loc, index) => (
                      <li key={`${loc._id}-${index}`}>{formatDate(loc.date) || "-"}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load.deliveryLocationId?.map((loc, index) => (
                      <li key={`${loc._id}-${index}`}>{loc.address || "-"}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load.deliveryLocationId?.map((loc, index) => (
                      <li key={`${loc._id}-${index}`}>{formatDate(loc.date) || "-"}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load?.carrierIds?.map(({carrier}, index) => (
                      <li key={`${carrier?._id}-${index}`}>{carrier?.primaryContact || "-"}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load?.carrierIds?.flatMap(({ assignDrivers }) => assignDrivers || [])
                      .map((driver, index) => (
                        <li key={index}>{driver.driverName || "-"}</li>
                      ))}
                  </ul>
                </td>
                <td>{load.equipmentType || "-"}</td>
                <td>
                  <ul className="data-list">
                    {load?.carrierIds?.map((carrier, index) => (
                      <li key={`${carrier?._id}-${index}`}>
                        {carrier?.driverInfo?.powerunit || "-"}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="data-list">
                    {load?.carrierIds?.map((carrier, index) => (
                      <li key={`${carrier?._id}-${index}`}>
                        {carrier?.driverInfo?.trailer || "-"}
                      </li>
                    ))}
                  </ul>
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
              <td colSpan="15" className="view-load__empty">
                No loads found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );

  return (
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

      <Modal 
        open={showInvoiceModal}
        onClose={handleCloseModal}
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {editingInvoice?._id ? 'Edit' : 'Create'} {invoiceType === 'customer' ? 'Customer' : 'Carrier'} Invoice
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {invoiceType === 'customer' ? (
            <CustomerInvoiceForm
              onSubmit={editingInvoice?._id ? handleEditInvoice : handleCreateInvoice}
              initialData={editingInvoice}
            />
          ) : (
            <CarrierInvoiceForm
              onSubmit={editingInvoice?._id ? handleEditInvoice : handleCreateInvoice}
              initialData={editingInvoice}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ViewLoad;