/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 7th 2023, 9:04:25 pm
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
    <>
      <p style={{ marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <TextField
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
    </>
  );
};

export default InputField;
