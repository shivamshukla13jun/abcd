import React from 'react';
import '@styles/Dashboard.scss';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { incomeData } from "@data/chartsData";

const Income = () => {
  // Updated income data with appropriate colors
  const updatedIncomeData = [
    { name: 'Broker', value: 30, color: '#3F51B5' },
    { name: 'Direct', value: 25, color: '#FF8A80' },
    { name: 'LTL', value: 20, color: '#FF9800' },
    { name: 'Other', value: 25, color: '#FFEB3B' }
  ];

  return (
    <div className="card mb-4 fixed-height-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title">INCOME</h5>
          <select className='text-secondary border-0'>
            <option selected>Last Month</option>
            <option value="1">Last 2 Months</option>
            <option value="2">Last 3 Months</option>
            <option value="3">Last 4 Months</option>
          </select>
        </div>
        <small>Last Week Income</small>
        <p className="font-heading-dashboard">$12,595</p>
        <p><span className="income-highlight">Up 35% </span> from prior month</p>
        
        <div className="mt-4 border-end pe-3">
          <div className="row">
            <div className="col-5">
              <div style={{ height: '110px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={updatedIncomeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                    >
                      {updatedIncomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="col-7">
              <div className="d-flex flex-wrap">
                {updatedIncomeData.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-1 me-3">
                    <div 
                      className="rounded-circle me-1"
                      style={{ backgroundColor: item.color, width: '8px', height: '8px' }} 
                    />
                    <span className="small text-muted">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Link className="mt-1 small text-decoration-none text-muted d-flex align-items-center">
            View all income <FaArrowRightLong className="ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Income;