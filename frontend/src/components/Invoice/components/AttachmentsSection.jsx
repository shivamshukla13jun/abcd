import React from 'react';
import { Grid, Paper, Typography, IconButton, Box } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const AttachmentsSection = ({ attachments, setAttachments }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 20971520,
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed #ccc',
          textAlign: 'center',
          cursor: 'pointer'
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
              key={file.id}
              sx={{
                p: 1,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{file.file.name}</Typography>
              <Box>
                <Typography component="span" sx={{ mx: 2, color: 'text.secondary' }}>
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
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