import React from 'react';
import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Delete, FileUpload } from '@mui/icons-material';

const AttachmentsSection = ({ attachments, onAdd, onRemove }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      onAdd({
        file,
        name: file.name,
        preview: URL.createObjectURL(file)
      });
    });
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="attachment-input"
      />
      <label htmlFor="attachment-input">
        <IconButton component="span" color="primary">
          <FileUpload />
        </IconButton>
      </label>

      <List>
        {attachments.map((attachment, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => onRemove(index)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={attachment.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AttachmentsSection;