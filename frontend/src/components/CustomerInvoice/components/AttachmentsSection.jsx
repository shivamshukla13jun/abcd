import React from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addAttachment, removeAttachment } from '@/redux/Slice/invoiceSlice';

const AttachmentsSection = ({ attachments }) => {
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      dispatch(addAttachment({
        file,
        name: file.name,
        preview: URL.createObjectURL(file)
      }));
    });
  };

  const handleRemove = (index) => {
    dispatch(removeAttachment(index));
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
        <Button
          component="span"
          variant="outlined"
          startIcon={<CloudUpload />}
        >
          Upload Files
        </Button>
      </label>

      {attachments?.map((file, index) => (
        <Box key={index} sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {file.name}
          </Typography>
          <IconButton size="small" onClick={() => handleRemove(index)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default AttachmentsSection;