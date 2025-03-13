import React from 'react';
import { Link } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";

const Tasks = () => {
  return (
    <div className="card mb-4 fixed-height-task">
      <div className="card-body">
        <h5 className="card-title">TASKS</h5>
        <ul className="list-unstyled">
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <p className="font-weight-bold">Remind your customers about 4 unpaid invoices</p>
              <p className="text-muted">Next time, you can get paid right from an invoice by connecting to</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <GoDotFill className="text-warning" />
              <span className="unpaid">Unpaid</span>
              <Link className="nav-link go">Go</Link>
            </div>
          </li>
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <p className="font-weight-bold">Remind your customers about 4 unpaid invoices</p>
              <p className="text-muted">Next time, you can get paid right from an invoice by connecting to</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <GoDotFill className="text-warning" />
              <span className="unpaid">Unpaid</span>
              <Link className="nav-link go">Go</Link>
            </div>
          </li>
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <p className="font-weight-bold">Pay 6 overdue bills</p>
              <p className="text-muted">They amount to $5,670.00.</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <GoDotFill className="text-danger" />
              <span className="overdue">Overdue</span>
              <Link className="nav-link go">Go</Link>
            </div>
          </li>
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <p className="font-weight-bold">Categorise 20 transactions</p>
              <p className="text-muted">They're worth up to $7,365.19</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <GoDotFill className="text-primary" />
              <span className="unpaid">Unpaid</span>
              <Link className="nav-link go">Go</Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
