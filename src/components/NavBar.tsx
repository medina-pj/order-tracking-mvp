'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '@/hooks/auth';

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
      console.log(err?.message);
    }
  };

  //FIXME: HIDE PAGES BASE ON USER TYPE
  console.log(userInfo);

  return (
    <AppBar position='sticky' style={{ height: '60px', backgroundColor: '#101932' }}>
      <Toolbar variant='dense'>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={handleOpenNavMenu}
          color='inherit'
        >
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
          onClose={handleCloseNavMenu}
        >
          <MenuItem key={'Home'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/dashboard'>
              Home
            </Typography>
          </MenuItem>
          <MenuItem key={'Orders'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/orders'>
              {'Orders'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Products'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/products'>
              {'Products'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Category'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/category'>
              {'Category'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Tables'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/stores/tables'>
              {'Tables'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Stores'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/stores'>
              {'Stores'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Accounts'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/accounts'>
              {'Accounts'}
            </Typography>
          </MenuItem>
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
