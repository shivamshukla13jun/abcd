// src/pages/Dashboard.js
import React from 'react';
import '@styles/Dashboard.scss';
import AccRecieveable from './Charts/AccRecieveable';
import AccPayable from './Charts/AccPayable';
import Income from './Charts/Income';
import ExpenSes from './Charts/ExpenSes';
import Tasks from './Tasks';
import ShortCuts from './ShortCuts';
import ProfitAndLoss from './Charts/ProfitAndLoss';
import Sales from './Charts/Sales';

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row mb-3">
        <div className="col-md-3">
       <ShortCuts/>
        </div>
        <div className="col-md-9">
         <Tasks/>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
        {/* Profit and loss */}
        <ProfitAndLoss/>
        </div>
        <div className="col-md-4">
        <ExpenSes/>
        </div>
        <div className="col-md-4">
       <Income/>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
      {/* Sales  */}
         <Sales/>
        </div>
        <div className="col-md-4">
          <AccRecieveable/>
        </div>
        <div className="col-md-4">
            
          <AccPayable/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;