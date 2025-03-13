import React, { useState, useEffect } from 'react';
import { Button, Container, Nav, Table } from 'react-bootstrap';
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiService from "@service/apiService";
import { toast } from "react-toastify";
import { formatDate } from '@utils/formatDate';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { resetLoad as resetnewLoad } from '@redux/Slice/loadSlice';
import { resetLoad } from '@redux/Slice/EditloadSlice';
import './ViewLoad.scss';

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
  const [loads, setLoads] = useState([]);
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
    dispatch(resetnewLoad());
    navigate("/createload");
  };

  const LoadTable = ({ data }) => (
    <div className="view-load__table-wrapper">
      <Table responsive>
        <thead>
          <tr>
            <th>Load No</th>
            <th>Status</th>
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
                <td>{load.customerId?.customerName || "-"}</td>
                <td>
                  {load.pickupLocationId?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.pickupLocationId.map((loc) => (
                        <li key={loc._id}>{loc.address || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.pickupLocationId?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.pickupLocationId.map((loc) => (
                        <li key={loc._id}>{formatDate(loc.date) || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.deliveryLocationId?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.deliveryLocationId.map((loc) => (
                        <li key={loc._id}>{loc.address || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.deliveryLocationId?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.deliveryLocationId.map((loc) => (
                        <li key={loc._id}>{formatDate(loc.date) || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.carrierIds.map((carrier) => (
                        <li key={carrier._id}>{carrier.primaryContact || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.carrierIds
                        .flatMap((carrier) => [carrier.driver1Name, carrier.driver2Name])
                        .filter((name) => name)
                        .map((name, index) => (
                          <li key={index}>{name}</li>
                        ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>{load.equipmentType || "-"}</td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.carrierIds.map((carrier) => (
                        <li key={carrier._id}>{carrier.powerunit || "-"}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td>
                  {load.carrierIds?.length > 0 ? (
                    <ul className="list-unstyled m-0">
                      {load.carrierIds.map((carrier) => (
                        <li key={carrier._id}>{carrier.trailer || "-"}</li>
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
  );
};

export default ViewLoad;
