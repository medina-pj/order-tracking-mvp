'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';
import Link from 'next/link';

const NavBar = () => {
  const { logout, userInfo } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      console.error(err?.message);
    }
  };

  return (
    <AppBar position='sticky' style={{ height: '60px', backgroundColor: '#101932' }}>
      <Toolbar variant='dense'>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={handleOpenNavMenu}
          color='inherit'>
          <MenuIcon />
        </IconButton>
        <Menu
          sx={{ mt: '45px' }}
          id='menu-appbar'
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}>
          <MenuItem key={'Orders'} onClick={handleCloseNavMenu}>
            {/* <Typography textAlign='center' component='a' href='/dashboard'>
              {'Orders'}
            </Typography> */}
            <Link href='/dashboard'>
              <Typography textAlign='center'>{'Dashboard'}</Typography>
            </Link>
          </MenuItem>
          <MenuItem key={'Create-Orders'} onClick={handleCloseNavMenu}>
            <Link href='/orders'>
              <Typography textAlign='center'>{'Orders'}</Typography>
            </Link>
            {/* <Typography textAlign='center' component='a' href='/orders'>
              {'Create Orders'}
            </Typography> */}
          </MenuItem>

          {[UserTypes.ADMIN, UserTypes.STORE_MANAGER].includes(userInfo?.userType as UserTypes) && [
            <MenuItem key={'Grouped-Products'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/products/groups'>
                {'Group Products'}
              </Typography> */}
              <Link href='/products/groups'>
                <Typography textAlign='center'>{'Group Products'}</Typography>
              </Link>
            </MenuItem>,

            <MenuItem key={'Products'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/products'>
                {'Products'}
              </Typography> */}
              <Link href='/products'>
                <Typography textAlign='center'>{'Products'}</Typography>
              </Link>
            </MenuItem>,

            <MenuItem key={'Tables'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/stores/tables'>
                {'Tables'}
              </Typography> */}
              <Link href='/stores/tables'>
                <Typography textAlign='center'>{'Tables'}</Typography>
              </Link>
            </MenuItem>,
          ]}

          <MenuItem key={'Record-Expenses'} onClick={handleCloseNavMenu}>
            {/* <Typography textAlign='center' component='a' href='/expenses/record'>
              {'Record Expenses'}
            </Typography> */}
            <Link href='/expenses/record'>
              <Typography textAlign='center'>{'Record Expenses'}</Typography>
            </Link>
          </MenuItem>
          <MenuItem key={'Expenses'} onClick={handleCloseNavMenu}>
            {/* <Typography textAlign='center' component='a' href='/expenses'>
              {'Expenses'}
            </Typography> */}
            <Link href='/expenses'>
              <Typography textAlign='center'>{'Expenses'}</Typography>
            </Link>
          </MenuItem>
          <MenuItem key={'Sales-Report'} onClick={handleCloseNavMenu}>
            {/* <Typography textAlign='center' component='a' href='/reports/sales'>
              {'Sales Report'}
            </Typography> */}
            <Link href='/reports/sales'>
              <Typography textAlign='center'>{'Sales Report'}</Typography>
            </Link>
          </MenuItem>
          {userInfo?.userType === UserTypes.ADMIN && [
            <MenuItem key={'Category'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/category'>
                {'Category'}
              </Typography> */}
              <Link href='/category'>
                <Typography textAlign='center'>{'Category'}</Typography>
              </Link>
            </MenuItem>,

            <MenuItem key={'Stores'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/stores'>
                {'Stores'}
              </Typography> */}
              <Link href='/stores'>
                <Typography textAlign='center'>{'Stores'}</Typography>
              </Link>
            </MenuItem>,

            <MenuItem key={'Accounts'} onClick={handleCloseNavMenu}>
              {/* <Typography textAlign='center' component='a' href='/accounts'>
                {'Accounts'}
              </Typography> */}
              <Link href='/accounts'>
                <Typography textAlign='center'>{'Accounts'}</Typography>
              </Link>
            </MenuItem>,
          ]}

          <MenuItem key={'Logout'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' onClick={onLogout}>
              {'Logout'}
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
