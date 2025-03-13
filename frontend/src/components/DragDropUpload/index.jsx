import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { addDocument } from '@redux/Slice/accountingSlice';
import './DragDropUpload.scss';

const DragDropUpload = ({ onUpload }) => {
  const dispatch = useDispatch();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        };
        dispatch(addDocument(fileData));
        if (onUpload) onUpload(fileData);
      };
      reader.readAsDataURL(file);
    });
  }, [dispatch, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="drag-drop-upload" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={`upload-area ${isDragActive ? 'active' : ''}`}>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default DragDropUpload;
