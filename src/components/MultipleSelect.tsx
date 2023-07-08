/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 2nd 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 7th 2023, 8:43:04 pm
 * ---------------------------------------------
 */

import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '100%',
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip({
  value,
  label,
  options,
  onChange,
}: {
  value: string[];
  label: string;
  options: { label: string; value: string }[];
  onChange: any;
}) {
  const theme = useTheme();

  return (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '5px', fontSize: '18px' }}>{label}</p>
      <FormControl style={{ marginBottom: '0.5rem', minWidth: '100%' }}>
        {/* <InputLabel id='multi-select-label'>{}</InputLabel> */}
        <Select
          labelId='multi-select-label'
          id='multi-select'
          multiple
          value={value}
          onChange={onChange}
          input={
            <OutlinedInput
              id='select-multiple'
              // label={label}
            />
          }
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={options.find(option => option.value === value)?.label} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value} style={getStyles(option.value, value, theme)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
