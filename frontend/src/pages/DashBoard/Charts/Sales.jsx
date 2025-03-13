import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import {  XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import {  dataset } from "@data/chartsData";
const Sales = () => {
  return (
    <div className="card mb-4 fixed-height-card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="card-title">SALES</h5>
        <select className='text-secondary border-0'>
          <option selected>Last Month</option>
          <option value="1">Last 2 Months</option>
          <option value="2">Last 3 Months</option>
          <option value="3">Last 4 Months</option>
        </select>
      </div>
      <small>Total sales</small>
      <p className="font-heading-dashboard">$0.00</p>
      <div className="mt-4">
        {/* <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Income</span>
          <span>$0</span>
        </div> */}
        <div className="mt-4 chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataset}
              margin={{ top: 10, right: 30, left: 50, bottom: 30 }}
            >
              <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value === 0 ? '$0' : `$${value}`}
                tickCount={5}
                domain={[0, 'dataMax + 500']}
                dx={-10}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Sales']}
              // contentStyle={{ borderRadius: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#58b02c"
                strokeWidth={3}
                dot={{ fill: '#58b02c', r: 4 }}
                activeDot={{ fill: '#58b02c', r: 6 }}
              />
              {/* <Legend 
    verticalAlign="bottom" 
    height={36}
    iconType="circle"
    iconSize={8}
  /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Link className="nav-link mt-4 d-block">View sales report  <FaArrowRightLong /></Link>
    </div>
  </div>
  )
}

export default Sales