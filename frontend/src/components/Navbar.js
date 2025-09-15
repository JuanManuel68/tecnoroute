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
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as DirectionsCarIcon,
  Route as RouteIcon,
  Assignment as AssignmentIcon,
  TrackChanges as TrackChangesIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const menuItems = [
    { label: 'Panel Principal', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Pedidos', path: '/admin/pedidos', icon: <ReceiptIcon /> },
    { label: 'Clientes', path: '/admin/clientes', icon: <PeopleIcon /> },
    { label: 'Conductores', path: '/admin/conductores', icon: <PeopleIcon /> },
    { label: 'Vehículos', path: '/admin/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Rutas', path: '/admin/rutas', icon: <RouteIcon /> },
    { label: 'Envíos', path: '/admin/envios', icon: <AssignmentIcon /> },
    { label: 'Seguimiento', path: '/admin/seguimiento', icon: <TrackChangesIcon /> },
  ];

  return (
    <AppBar position="fixed">
      <Toolbar>
        <LocalShippingIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/admin')}
        >
          TecnoRoute - Panel Administrativo
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
          
          {/* User Menu */}
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Tooltip title={`Usuario: ${user?.name || 'Administrador'}`}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleUserMenuClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={userMenuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(userMenuAnchorEl)}
              onClose={handleUserMenuClose}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">{user?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {user?.email} (Administrador)
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 2 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
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
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ mr: 2 }} />
              <Typography sx={{ ml: 2 }}>Cerrar Sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
