/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 10:58:28 am
 * ---------------------------------------------
 */

import { TextField } from '@mui/material';
import { CSSProperties } from 'react';

const InputField = ({ value, label, onChange }: { value: any; label: string; onChange: any }) => {
  const style: CSSProperties = {
    marginBottom: '10px',
  };

  return (
    <TextField
      size='small'
      label={label}
      fullWidth={true}
      variant='outlined'
      style={style}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default InputField;
