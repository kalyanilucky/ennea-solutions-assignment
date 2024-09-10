import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button, Typography } from '@mui/material';

const FileUploader = ({ onDataParsed }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onDataParsed(results.data);
        },
      });
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload Inventory CSV</Typography>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <Button variant="contained" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  );
};

export default FileUploader;
