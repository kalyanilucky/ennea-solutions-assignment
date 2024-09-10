import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Select, MenuItem, InputBase, IconButton, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const InventoryTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  const aggregatedData = useMemo(() => {
    const result = {};
    data.forEach((row) => {
      const key = row.name;
      if (!result[key]) {
        result[key] = {
          name: key,
          batch: 'All',
          stock: 0,
          deal: Infinity,
          free: Infinity,
          mrp: -Infinity,
          rate: -Infinity,
          exp: null,
          batches: [],
        };
      }
      result[key].stock += parseFloat(row.stock) || 0;
      result[key].deal = Math.min(result[key].deal, parseFloat(row.deal) || Infinity);
      result[key].free = Math.min(result[key].free, parseFloat(row.free) || Infinity);
      result[key].mrp = Math.max(result[key].mrp, parseFloat(row.mrp) || -Infinity);
      result[key].rate = Math.max(result[key].rate, parseFloat(row.rate) || -Infinity);
      result[key].exp = !result[key].exp || new Date(row.exp) < new Date(result[key].exp) ? row.exp : result[key].exp;
      result[key].batches.push(row);
    });
    return Object.values(result);
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = aggregatedData.filter(row => row.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <FormControl variant="outlined">
        <InputBase
          placeholder="Search by name"
          startAdornment={<IconButton><SearchIcon /></IconButton>}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Deal</TableCell>
              <TableCell>Free</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Expiry Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {row.batches.map((batch, index) => (
                      <MenuItem key={index} value={batch.batch}>
                        {batch.batch}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{selectedBatch === 'All' ? row.stock : row.batches.find(b => b.batch === selectedBatch)?.stock}</TableCell>
                <TableCell>{selectedBatch === 'All' ? row.deal : row.batches.find(b => b.batch === selectedBatch)?.deal}</TableCell>
                <TableCell>{selectedBatch === 'All' ? row.free : row.batches.find(b => b.batch === selectedBatch)?.free}</TableCell>
                <TableCell>{selectedBatch === 'All' ? row.mrp : row.batches.find(b => b.batch === selectedBatch)?.mrp}</TableCell>
                <TableCell>{selectedBatch === 'All' ? row.rate : row.batches.find(b => b.batch === selectedBatch)?.rate}</TableCell>
                <TableCell>{selectedBatch === 'All' ? row.exp : row.batches.find(b => b.batch === selectedBatch)?.exp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default InventoryTable;
