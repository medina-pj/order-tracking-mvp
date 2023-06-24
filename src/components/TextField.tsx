/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 24th 2023, 10:55:17 pm
 * ---------------------------------------------
 */

import { TextField } from '@mui/material';
import { CSSProperties } from 'react';

const InputField = ({
  value,
  label,
  type = 'text',
  onChange,
}: {
  value: any;
  label: string;
  type?: string;
  onChange: any;
}) => {
  const style: CSSProperties = {
    marginBottom: '10px',
  };

  return (
    <TextField
      size='small'
      label={label}
      fullWidth={true}
      variant='outlined'
      type={type}
      style={style}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default InputField;
