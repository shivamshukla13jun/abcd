import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { addTodoItem, removeTodoItem, toggleTodoItem } from '@redux/Slice/accountingSlice';
import { FaTrash, FaCheck } from 'react-icons/fa';
import './TodoList.scss';

const TodoList = () => {
  const dispatch = useDispatch();
  const todoList = useSelector(state => state.accounting.todoList);
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      dispatch(addTodoItem({
        id: Date.now(),
        text: newItem,
        completed: false
      }));
      setNewItem('');
    }
  };

  const handleRemove = (id) => {
    dispatch(removeTodoItem(id));
  };

  const handleToggle = (id) => {
    dispatch(toggleTodoItem(id));
  };

  return (
    <div className="todo-list">
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new task..."
            className="me-2"
          />
          <Button type="submit" variant="primary">Add</Button>
        </Form.Group>
      </Form>

      <ListGroup>
        {todoList.map((item) => (
          <ListGroup.Item
            key={item.id}
            className="d-flex justify-content-between align-items-center todo-item"
          >
            <div className="d-flex align-items-center">
              <Button
                variant={item.completed ? "success" : "outline-secondary"}
                size="sm"
                className="me-2 toggle-btn"
                onClick={() => handleToggle(item.id)}
              >
                <FaCheck />
              </Button>
              <span className={item.completed ? 'completed' : ''}>
                {item.text}
              </span>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleRemove(item.id)}
              className="remove-btn"
            >
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TodoList;
