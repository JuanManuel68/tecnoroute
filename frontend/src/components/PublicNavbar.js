import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  ContactMail as ContactMailIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PublicNavbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const menuItems = [
    { label: 'Inicio', path: '/', icon: <LocalShippingIcon /> },
    { 
      label: 'Productos', 
      path: isAuthenticated ? '/productos' : '/login?type=user', 
      icon: <StoreIcon />
    },
    { label: 'Contacto', path: '/contact', icon: <ContactMailIcon /> },
  ];

  // Menu items especiales para usuarios autenticados
  const userMenuItems = isAuthenticated ? [
    { label: 'Mis Pedidos', path: '/orders', icon: <ReceiptIcon /> }
  ] : [];

  const authItems = !isAuthenticated ? [
    { label: 'Iniciar Sesión', path: '/login', icon: <LoginIcon /> },
    { label: 'Registrarse', path: '/register', icon: <PersonAddIcon /> },
  ] : [];

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <LocalShippingIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          TecnoRoute
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.badge ? (
                <Badge badgeContent={item.badge} color="secondary">
                  {item.icon}
                </Badge>
              ) : item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{ mx: 0.5 }}
            >
              {item.label}
            </Button>
          ))}
          
          {/* User menu items for authenticated users */}
          {userMenuItems.map((item) => (
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
          
          <Box sx={{ ml: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Auth buttons for non-authenticated users */}
            {authItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                variant={item.label === 'Registrarse' ? 'outlined' : 'text'}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Cart Icon for authenticated users */}
            {isAuthenticated && (
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={getCartItemsCount()} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            
            {/* User menu for authenticated users */}
            {isAuthenticated && (
              <>
                <Tooltip title={`Usuario: ${user?.name || 'Usuario'}`}>
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuClick}
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchor}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="subtitle2">{user?.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                    <LoginIcon sx={{ mr: 2 }} />
                    Mi Perfil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon sx={{ mr: 2 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMobileMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="secondary">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                  <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}
            
            {/* User menu items for mobile authenticated users */}
            {userMenuItems.map((item) => (
              <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                  <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}
            
            {authItems.map((item) => (
              <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                  <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}

            {/* Cart and user options for mobile authenticated users */}
            {isAuthenticated && (
              <>
                <MenuItem onClick={() => handleNavigation('/cart')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge badgeContent={getCartItemsCount()} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                    <Typography sx={{ ml: 2 }}>Carrito</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LoginIcon />
                    <Typography sx={{ ml: 2 }}>Mi Perfil</Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ExitToAppIcon />
                    <Typography sx={{ ml: 2 }}>Cerrar Sesión</Typography>
                  </Box>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;
