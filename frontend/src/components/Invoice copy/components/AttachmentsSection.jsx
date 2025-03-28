import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Paper, Typography, IconButton, Grid } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

const AttachmentsSection = ({ attachments, setAttachments, setValue, watch }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 20971520,
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
        isNew: true // Flag to identify newly uploaded files
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  });

  const handleRemoveFile = (index) => {
    const fileToRemove = attachments[index];
    
    // Check if the file has originalname (meaning it's an existing file)
    if (fileToRemove.originalname) {
      // Get current deletedfiles array or initialize empty array
      const currentDeletedFiles = watch('deletedfiles') || [];
      // Add the originalname to deletedfiles array
      setValue('deletedfiles', [...currentDeletedFiles, fileToRemove.filename]);
    }

    // Remove the file from attachments
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileSize = (file) => {
    // For new files
    if (file.file?.size) {
      return (file.file.size / 1024 / 1024).toFixed(2);
    }
    // For existing Multer files
    if (file.size) {
      return (file.size / 1024 / 1024).toFixed(2);
    }
    return '0.00';
  };

  const getFileName = (file) => {
    // For new files
    if (file.file?.name) {
      return file.file.name;
    }
    // For existing Multer files
    if (file.originalname) {
      return file.originalname;
    }
    // For files with filename property
    if (file.filename) {
      return file.filename;
    }
    return 'Unknown file';
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'background.default',
          border: '2px dashed',
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography>
          Drag/Drop files here or click to select files
        </Typography>
      </Paper>

      {attachments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {attachments.map((file, index) => (
            <Paper
              key={file.id || file.filename || index}
              sx={{
                p: 1,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{getFileName(file)}</Typography>
              <Box>
                <Typography component="span" sx={{ mx: 2, color: 'text.secondary' }}>
                  {getFileSize(file)} MB
                </Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AttachmentsSection;