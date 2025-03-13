import React from 'react';
import { Grid, Paper, Typography, TextField, Box } from '@mui/material';

const TotalsSection = ({ totals, register, watch }) => {
  return (
    
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='strong' fontWeight={600}>Subtotal</Typography>
              <Typography variant='strong' fontWeight={600}>${totals.subTotal.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='strong' fontWeight={600}>Discount Percent</Typography>
                <TextField
                  size="small"
                  type="number"
                  {...register('discountPercent')}
                  sx={{ width: 70, mx: 1 }}
                  InputProps={{
                    endAdornment: '%'
                  }}
                />
              </Box>
              <Typography variant='strong' fontWeight={600}>${totals.totalDiscount.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='strong' fontWeight={600}>Total</Typography>
              <Typography variant='strong' fontWeight={600}>${totals.total.toFixed(2)}</Typography>
            </Box>
            {/* Deposit */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='strong' fontWeight={600}>Deposit</Typography>
                <TextField
                  size="small"
                  type="number"
                  {...register('deposit')}
                  sx={{ width: 70, mx: 1 }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='strong' fontWeight={600}>Balance Due</Typography>
              <Typography variant='strong' fontWeight={600}>${totals.balanceDue.toFixed(2)}</Typography>
            </Box>
          </Paper>
       
  );
};

export default TotalsSection; 