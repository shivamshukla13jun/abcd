import React, { useState } from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';
import { FaSort, FaEllipsisV } from 'react-icons/fa';
import './ViewDocuments.scss';

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Bill of Lading',
      uploadDate: '2024-01-17',
      uploadSource: '',
      description: 'The BOL document for this load. Contains the detail...',
      attachedTo: 'Load 21',
      type: 'BOL'
    },
    {
      id: 2,
      name: 'Carrier Confirmation',
      uploadDate: '2024-01-17',
      uploadSource: '',
      description: '',
      attachedTo: 'Load 21',
      type: 'Confirmation'
    },
    // Add more sample documents as needed
  ]);

  const handleAddDocument = () => {
    // Implement document upload logic
    console.log('Add document clicked');
  };

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <Button
      ref={ref}
      variant="link"
      onClick={onClick}
      className="action-button p-0"
    >
      <FaEllipsisV />
    </Button>
  ));

  return (
    <div className="documents-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Documents</h2>
        <Button variant="primary" onClick={handleAddDocument}>
          + Add Document
        </Button>
      </div>

      <div className="table-responsive">
        <Table hover className="documents-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="form-check-input" />
              </th>
              <th>
                Document Name <FaSort className="sort-icon" />
              </th>
              <th>
                Upload Date <FaSort className="sort-icon" />
              </th>
              <th>
                Upload Source <FaSort className="sort-icon" />
              </th>
              <th>
                Description <FaSort className="sort-icon" />
              </th>
              <th>
                Attached To <FaSort className="sort-icon" />
              </th>
              <th>
                Document Type <FaSort className="sort-icon" />
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <input type="checkbox" className="form-check-input" />
                </td>
                <td>{doc.name}</td>
                <td>{doc.uploadDate}</td>
                <td>{doc.uploadSource}</td>
                <td className="description-cell">{doc.description}</td>
                <td>{doc.attachedTo}</td>
                <td>{doc.type}</td>
                <td>
                  <Dropdown align="end">
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => console.log('View', doc.id)}>
                        View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log('Edit', doc.id)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => console.log('Delete', doc.id)}
                        className="text-danger"
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ViewDocuments;
