/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: PJ Medina - <paulo@healthnow.ph>
 * Last Modified time: June 11th 2023, 10:58:18 am
 * ---------------------------------------------
 */

import { Button } from '@mui/material';
import { CSSProperties } from 'react';

const InputField = ({ label, onClick }: { label: string; onClick: any }) => {
  const style: CSSProperties = {
    marginBottom: '10px',
  };

  return (
    <Button variant='outlined' size='small' style={style} onClick={onClick} fullWidth={true}>
      {label}
    </Button>
  );
};

export default InputField;
