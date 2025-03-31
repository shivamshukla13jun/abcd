import React from 'react';
import { Grid, Paper, Typography, TextField, Box, MenuItem } from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
const TotalsSection = ({ totals, register, watch ,TAX_OPTIONS=[]}) => {
  
  return (
    
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='strong' fontWeight={600}>Subtotal</Typography>
              <Typography variant='strong' fontWeight={600}>${totals.subTotal.toFixed(2)}</Typography>
            </Box>
             {/* Add Tax From DropwDown */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='strong' fontWeight={600}>Tax</Typography>
              <TextField
                select
                // size="small"
                value={watch("tax")}
                {...register('tax')}
                // sx={{ width: 70, mx: 1 }}
              >
                {TAX_OPTIONS.map((tax) => (
                  <MenuItem key={tax._id} value={tax._id}>
                  {tax.label} ({tax.value}%)
                  </MenuItem>
                ))}
              </TextField>
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
              <Typography variant='strong' fontWeight={600}>{formatCurrency(totals.totalDiscount.toFixed(2))}</Typography>
            </Box>
             
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='strong' fontWeight={600}>Total</Typography>
              <Typography variant='strong' fontWeight={600}>{formatCurrency(totals.total.toFixed(2))}</Typography>
            </Box>
            {/* Deposit */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='strong' fontWeight={600}>Deposit</Typography>
                <TextField
                  size="small"
                  type="number"
                  {...register('deposit')}
                  InputProps={{
                    endAdornment: '$'
                  }}
                  // sx={{ width: 70, mx: 1 }}
                />
            </Box>
            
            {/* Total After Tax */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='strong' fontWeight={600}>Balance Due</Typography>
              <Typography variant='strong' fontWeight={600}>{formatCurrency(totals.balanceDue.toFixed(2))}</Typography>
            </Box>
          </Paper>
       
  );
};

export default TotalsSection; 