import React from 'react';
import '@styles/Dashboard.scss';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { payablesData, legendData } from '@data/chartsData';
import { GoDotFill } from 'react-icons/go';

const AccPayable = () => {
  return (
    <div className="card mb-4 fixed-height-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title text-truncate">ACCOUNTS PAYABLE</h5>
          <select className="text-secondary border-0">
            <option selected>Last Month</option>
            <option value="1">Last 2 Months</option>
            <option value="2">Last 3 Months</option>
            <option value="3">Last 4 Months</option>
          </select>
        </div>
        <small>Total A/P amount</small>
        <p className="font-heading-dashboard">$33,860.82</p>
        <div className="mt-4 chart-container">
          <div className="row align-items-center w-100">
            <div className="col-md-6 ">
              {legendData.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                     <GoDotFill color={item.color} />
                  <div className="d-flex flex-column">
                    <span className="fw-medium text-dark">{item.amount}</span>
                    <span className="small" style={{ color: item.color }}>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-6">
              <div style={{ height: '200px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={payablesData}
                      dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    cornerRadius={5}
                    >
                      {payablesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <Link className="nav-link mt-4 d-block text-start">
          View accounts payable <FaArrowRightLong />
        </Link>
      </div>
    </div>
  );
};

export default AccPayable;
