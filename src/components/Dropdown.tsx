/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Saturday July 8th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 7:20:56 pm
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
    <FormControl fullWidth style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <Select
        disabled={disabled}
        labelId='user-type-select'
        id='user-type-select-id'
        value={value}
        onChange={onChange}>
        {options.map((option, key) => (
          <MenuItem key={key} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
