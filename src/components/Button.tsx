/*
 * ---------------------------------------------
 * Author: PJ Medina
 * Date:   Sunday June 11th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 12th 2023, 10:35:52 pm
 * ---------------------------------------------
 */

import { Button, CircularProgress } from '@mui/material';
import { CSSProperties } from 'react';

const ButtonField = ({
  label,
  onClick,
  loading = false,
  disabled,
}: {
  label: string;
  onClick: any;
  loading?: boolean;
  disabled?: boolean;
}) => {
  const isDisabled = disabled ? disabled : loading;
  const style: CSSProperties = {
    marginBottom: '10px',
    marginTop: '20px',
    backgroundColor: !isDisabled ? '#101932' : '#9B9B9B',
    height: '50px',
    fontSize: '16px',
    textTransform: 'none',
    fontFamily: 'inherit',
  };

  return (
    <Button
      disabled={isDisabled}
      variant='contained'
      size='small'
      style={style}
      onClick={onClick}
      fullWidth={true}
      disableRipple>
      {!loading ? (
        <a style={{ color: 'white' }}>{label}</a>
      ) : (
        <CircularProgress size='30px' style={{ color: 'white' }} />
      )}
    </Button>
  );
};

export default ButtonField;
