import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";

const ProfitAndLoss = () => {
  return (
    <div className="card mb-4 fixed-height-card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="card-title">PROFIT & LOSS</h5>
        <select className='text-secondary border-0'>
          <option selected>Last Month</option>
          <option value="1">Last 2 Months</option>
          <option value="2">Last 3 Months</option>
          <option value="3">Last 4 Months</option>
        </select>
      </div>
      <small>No Profit For September</small>
      <p className="font-heading-dashboard">- $3,015</p>
      <p> <span className='down-highlight'> Down 80% </span> from prior month</p>
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Income</span>
          <span>$0</span>
        </div>
        <div className="progress" style={{ height: '20px' }}>
          <div className="progress-bar bg-income-highlight" role="progressbar" style={{ width: '100%' }}></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Expenses</span>
          <span>$3,015</span>
        </div>
        <div className="progress" style={{ height: '20px' }}>
          <div className="progress-bar bg-expense-highlight" role="progressbar" style={{ width: '100%' }}></div>
        </div>
      </div>
      <Link className="nav-link mt-4 d-block ">See profit and loss report  <FaArrowRightLong /></Link>
    </div>
  </div>
  )
}

export default ProfitAndLoss