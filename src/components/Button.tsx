/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulojohn.medina@gmail.com>
 * Last Modified time: July 11th 2023, 9:05:22 pm
 * ---------------------------------------------
 */

import { Button } from '@mui/material';
import { CSSProperties } from 'react';

const ButtonField = ({ label, onClick }: { label: string; onClick: any }) => {
  const style: CSSProperties = {
    marginBottom: '10px',
    marginTop: '20px',
    backgroundColor: '#101932',
    height: '50px',
    fontSize: '16px',
    textTransform: 'none',
    fontFamily: 'inherit',
  };

  return (
    <Button variant='contained' size='small' style={style} onClick={onClick} fullWidth={true} disableRipple>
      {label}
    </Button>
  );
};

export default ButtonField;
