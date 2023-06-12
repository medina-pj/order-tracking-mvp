'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position='sticky'>
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
            <Typography textAlign='center' component='a' href='/'>
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
          <MenuItem key={'Tables'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/tables'>
              {'Tables'}
            </Typography>
          </MenuItem>
          <MenuItem key={'Category'} onClick={handleCloseNavMenu}>
            <Typography textAlign='center' component='a' href='/category'>
              {'Category'}
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
