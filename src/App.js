import React, { useState } from 'react';
import FileUploader from './FileUploader';
import InventoryTable from './InventoryTable';
import { Container, Typography, Box } from '@mui/material';

const App = () => {
  const [data, setData] = useState([]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <Box mb={4}>
        <FileUploader onDataParsed={(parsedData) => setData(parsedData)} />
      </Box>
      {data.length > 0 && <InventoryTable data={data} />}
    </Container>
  );
};

export default App;
