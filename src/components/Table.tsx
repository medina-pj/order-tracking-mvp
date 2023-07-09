/*
 * ---------------------------------------------
 * Author: Rovelin Enriquez
 * Date:   Sunday July 9th 2023
 * Last Modified by: Rovelin Enriquez - <enriquezrovelin@gmail.com>
 * Last Modified time: July 9th 2023, 6:25:37 pm
 * ---------------------------------------------
 */

import { IconButton, TableContainer, TableHead, Table, TableCell, TableRow, TableBody } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface RowInterface {
  id?: string | number;
  label?: string;
  subLabel?: string;
  labelList?: string;
  list?: string[];
}

const TableComponent = ({
  label,
  rows,
  onSelect,
  onDelete,
}: {
  label?: string;
  rows: RowInterface[];
  onSelect?: (id: string) => void;
  onDelete?: (id: any) => void;
}) => {
  const renderStoreCell = (row: RowInterface) => {
    return (
      <>
        <p>
          <b>{row?.label || ''}</b>
          <br />
          <a style={{ color: 'gray' }}> {row?.subLabel || ''}</a>
        </p>
        {row.labelList && row?.list?.length && (
          <>
            <hr />
            <i>{row.labelList}:</i>
            <br />
            {row?.list.map((data, i) => (
              <a key={i}>
                {data}
                <br />
              </a>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <>
      {label && <p style={{ fontSize: '28px', textAlign: 'center' }}>{label}</p>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center' style={{ fontFamily: 'inherit' }}>
                #
              </TableCell>
              <TableCell style={{ fontFamily: 'inherit' }}>Details</TableCell>
              {onDelete && <TableCell style={{ padding: 0, width: '20px' }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, i: number) => (
              <TableRow key={i} onClick={() => onSelect && onSelect(row?.id)}>
                <TableCell align='center' style={{ fontFamily: 'inherit', padding: 0, width: '20px' }}>
                  {i + 1}
                </TableCell>
                <TableCell style={{ fontFamily: 'inherit' }}>{renderStoreCell(row)}</TableCell>
                {onDelete && (
                  <TableCell align='center' style={{ padding: 0, width: '20px' }}>
                    <IconButton onClick={() => onDelete(row?.id)}>
                      <DeleteForeverIcon style={{ color: '#ea6655' }} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableComponent;
