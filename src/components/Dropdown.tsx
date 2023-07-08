/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 8th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 8th 2023, 11:38:10 am
 * ---------------------------------------------
 */

import { MenuItem, Select, FormControl, InputLabel, keyframes } from '@mui/material';

export default function DropdownField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: any;
  options: { value: string; label: string }[];
}) {
  return (
    <FormControl fullWidth style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <Select
        labelId='user-type-select'
        id='user-type-select-id'
        value={value}
        // label='Select user type'
        onChange={e => onChange(e.target.value)}>
        {options.map((option, key) => (
          <MenuItem key={key} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
