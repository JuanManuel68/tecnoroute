import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as DirectionsCarIcon,
  Route as RouteIcon,
  Assignment as AssignmentIcon,
  TrackChanges as TrackChangesIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Panel Principal', path: '/', icon: <DashboardIcon /> },
    { label: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { label: 'Conductores', path: '/conductores', icon: <PeopleIcon /> },
    { label: 'Vehículos', path: '/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Rutas', path: '/rutas', icon: <RouteIcon /> },
    { label: 'Envíos', path: '/envios', icon: <AssignmentIcon /> },
    { label: 'Seguimiento', path: '/seguimiento', icon: <TrackChangesIcon /> },
  ];

  return (
    <AppBar position="fixed">
      <Toolbar>
        <LocalShippingIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          TecnoRoute - Sistema de Transporte y Logística
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{ mx: 0.5 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            color="inherit"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="mobile-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                  <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
