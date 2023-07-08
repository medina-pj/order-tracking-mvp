/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Thursday July 6th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 6th 2023, 11:33:40 pm
 * ---------------------------------------------
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearIndeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
