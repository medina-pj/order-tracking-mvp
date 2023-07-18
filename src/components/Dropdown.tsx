/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 8th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 18th 2023, 1:06:34 pm
 * ---------------------------------------------
 */

import { MenuItem, Select, FormControl } from '@mui/material';

export default function DropdownField({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: any;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <FormControl fullWidth>
      <p style={{ fontFamily: 'inherit', marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <Select
        sx={{ '.MuiOutlinedInput-notchedOutline': { borderStyle: 'none' }, backgroundColor: '#F0F0F0' }}
        disabled={disabled}
        labelId='user-type-select'
        id='user-type-select-id'
        value={value}
        onChange={onChange}>
        {options.map((option, key) => (
          <MenuItem key={key} value={option.value} style={{ fontFamily: 'inherit' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
