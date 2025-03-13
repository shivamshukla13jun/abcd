import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Card, Tab, Tabs } from 'react-bootstrap';
import { fetchExpenses, uploadDocument } from '../../../redux/Slice/accountingSlice';
import DragDropUpload from '../../../components/DragDropUpload';
import TodoList from '../../../components/TodoList';
import './Expenses.scss';

const Expenses = () => {
  const dispatch = useDispatch();
  const { data: expenses, loading, error } = useSelector(state => state.accounting.expenses);
  const { loading: uploadLoading } = useSelector(state => state.accounting.documents);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDocumentUpload = (file) => {
    dispatch(uploadDocument(file));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="expenses-page">
      <Card>
        <Card.Header>
          <h2>Expense Management</h2>
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey="list" className="mb-3">
            <Tab eventKey="list" title="Expense List">
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Expense Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.expenseType}</td>
                      <td>${expense.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${expense.status.toLowerCase()}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>
                        <Button variant="primary" size="sm" className="me-2">
                          View Details
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="upload" title="Upload Receipts">
              <div className="upload-section">
                <h4>Upload Expense Receipts</h4>
                <DragDropUpload 
                  onUpload={handleDocumentUpload}
                  loading={uploadLoading}
                />
              </div>
            </Tab>
            <Tab eventKey="todo" title="To-Do List">
              <div className="todo-section">
                <h4>Expense Tasks</h4>
                <TodoList />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Expenses;
