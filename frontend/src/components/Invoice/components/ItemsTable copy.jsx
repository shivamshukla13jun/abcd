import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { TAX_OPTIONS } from '../constants';

const ItemsTable = ({ fields, register, remove, append, watch, setValue }) => {
  const handleAddItem = () => {
    append({
      itemDetails: '',
      description: '',
      qty: 1,
      rate: 0,
      // discount: 0,
      amount: 0
    });
  };

  const calculateItemAmount = (item) => {
    if (!item) return 0;
    const baseAmount = (item.qty || 0) * (item.rate || 0);
    const taxAmount = baseAmount/ 100;
    // const discountAmount = item.discount || 0;
    return Number((baseAmount + taxAmount ).toFixed(2));
  };

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>PRODUCT/SERVICE</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell>QTY</TableCell>
              <TableCell>RATE</TableCell>
              <TableCell>AMOUNT</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(`items.${index}.itemDetails`)}
                    placeholder="Enter item details"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(`items.${index}.description`)}
                    placeholder="Enter description"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    {...register(`items.${index}.qty`)}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    {...register(`items.${index}.rate`)}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </TableCell>
                <TableCell>
                  ${calculateItemAmount(watch(`items.${index}`)).toFixed(2)}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<Add />}
        onClick={handleAddItem}
        sx={{ mt: 2 }}
      >
        Add Item
      </Button>
    </Grid>
  );
};

export default ItemsTable; 