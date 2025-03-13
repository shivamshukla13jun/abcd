import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './AccountingLayout.scss';

const AccountingLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="accounting-layout">
      <Nav className="accounting-nav" variant="tabs">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/accounting/payments"
            active={location.pathname === '/accounting/payments'}
          >
            Payments
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/accounting/invoices"
            active={location.pathname === '/accounting/invoices'}
          >
            Invoices
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/accounting/expenses"
            active={location.pathname === '/accounting/expenses'}
          >
            Expenses
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/accounting/ratings"
            active={location.pathname === '/accounting/ratings'}
          >
            Ratings
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Container fluid className="accounting-content">
        {children}
      </Container>
    </div>
  );
};

export default AccountingLayout;
