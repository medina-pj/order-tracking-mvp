/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 7th 2023, 7:23:54 pm
 * ---------------------------------------------
 */

import { Button } from '@mui/material';
import { CSSProperties } from 'react';

const ButtonField = ({ label, onClick }: { label: string; onClick: any }) => {
  const style: CSSProperties = {
    marginBottom: '10px',
    backgroundColor: '#101932',
    height: '60px',
    fontSize: '18px',
    textTransform: 'none',
  };

  return (
    <Button variant='contained' size='small' style={style} onClick={onClick} fullWidth={true} disableRipple>
      {label}
    </Button>
  );
};

export default ButtonField;
