/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 1:05:24 pm
 * ---------------------------------------------
 */

import { Box, TextField } from '@mui/material';
import { CSSProperties } from 'react';

const InputField = ({
  value,
  label,
  type = 'text',
  onChange,
  disabled = false,
}: {
  value: any;
  label: string;
  type?: string;
  onChange?: any;
  disabled?: boolean;
}) => {
  const style: CSSProperties = {
    marginBottom: '10px',
  };

  return (
    <Box>
      <p style={{ marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <TextField
        disabled={disabled}
        size='medium'
        fullWidth={true}
        variant='filled'
        type={type}
        style={style}
        value={value}
        onChange={e => onChange(e.target.value)}
        InputProps={{
          hiddenLabel: true,
          disableUnderline: true,
          style: {
            fontSize: '18px',
            fontFamily: 'inherit',
            borderRadius: '4px',
          },
        }}
      />
    </Box>
  );
};

export default InputField;
