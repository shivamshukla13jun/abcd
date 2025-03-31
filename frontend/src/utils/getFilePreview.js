 const getFilePreview = (file,destination="") => {
  if (file.isNew) {
    return file.preview;
  }
  if (file.filename) {
    return `${import.meta.env.VITE_FILE_UPLOAD_URL}/${file.filename}`;
  }
  return null;
  };
  export {getFilePreview}