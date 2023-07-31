'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '@/hooks/auth';
import { UserTypes } from '@/types/schema/user';

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
            <Typography textAlign='center' component='a' href='/dashboard'>
              {'Orders'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Create-Orders'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/orders'>
              {'Create Orders'}
            </Typography>
          </MenuItem>

          {[UserTypes.ADMIN, UserTypes.STORE_MANAGER].includes(userInfo?.userType as UserTypes) && [
            <MenuItem key={'Grouped-Products'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/products/groups'>
                {'Group Products'}
              </Typography>
            </MenuItem>,

            <MenuItem key={'Products'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/products'>
                {'Products'}
              </Typography>
            </MenuItem>,

            <MenuItem key={'Tables'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/stores/tables'>
                {'Tables'}
              </Typography>
            </MenuItem>,
          ]}

          <MenuItem key={'Record-Expenses'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/expenses/record'>
              {'Record Expenses'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Expenses'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/expenses'>
              {'Expenses'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Sales-Report'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/reports/sales'>
              {'Sales Report'}
            </Typography>
          </MenuItem>
          {userInfo?.userType === UserTypes.ADMIN && [
            <MenuItem key={'Category'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/category'>
                {'Category'}
              </Typography>
            </MenuItem>,

            <MenuItem key={'Stores'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/stores'>
                {'Stores'}
              </Typography>
            </MenuItem>,

            <MenuItem key={'Accounts'} onClick={handleCloseNavMenu}>
              <Typography textAlign='center' component='a' href='/accounts'>
                {'Accounts'}
              </Typography>
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
