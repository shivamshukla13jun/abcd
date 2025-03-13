import React from 'react';
import '@styles/Dashboard.scss';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaFileInvoice, FaMoneyBill, FaTruckLoading } from "react-icons/fa";


const ShortCuts = () => {
  return (
    <div className="card  fixed-height-task">
    <div className="card-body">
      <h5 className="card-title">SHORTCUTS</h5>
      <ul className="list-unstyled shortcut">
        <li className="mb-2">
          <Link className="nav-link">
            <FaFileInvoice className="me-2" />
            <span>Create Invoice</span>
          </Link>
        </li>
      
        <li className="mb-2">
          <Link className="nav-link">
            <FaTruckLoading className="me-2" />
            <span>Create Load</span>
          </Link>
        </li>
        <li className="mb-2">
          <Link className="nav-link">
            <FaCreditCard className="me-2" />
            <span>Take payment</span>
          </Link>
        </li>
        <li className="mb-2">
          <Link className="nav-link">
            <FaMoneyBill className="me-2" />
            <span>Pay bills</span>
          </Link>
        </li>
      </ul>
      <Link className="nav-link">Show all</Link>
    </div>
  </div>
  )
}

export default ShortCuts