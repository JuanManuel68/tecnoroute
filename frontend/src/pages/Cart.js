import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    setSnackbar({
      open: true,
      message: `${productName} removido del carrito`,
      severity: 'info'
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'El carrito está vacío',
        severity: 'warning'
      });
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 25.00;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ¡Agrega algunos productos increíbles a tu carrito!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/productos')}
            sx={{ mt: 2 }}
          >
            Continuar Comprando
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/productos')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          🛒 Mi Carrito ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Items del Carrito */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {cartItems.map((item) => (
              <Box key={item.id}>
                <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                  {/* Imagen del producto */}
                  <Grid item xs={3} sm={2}>
                    <CardMedia
                      component="img"
                      image={item.imagen}
                      alt={item.nombre}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>

                  {/* Información del producto */}
                  <Grid item xs={9} sm={4}>
                    <Typography variant="h6" noWrap>
                      {item.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.marca}
                    </Typography>
                    <Chip 
                      label={item.categoria} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mt: 1 }}
                    />
                  </Grid>

                  {/* Controles de cantidad */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        sx={{ mx: 1, width: 70 }}
                        size="small"
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Precio y acciones */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        ${(item.precio * item.quantity).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.precio} c/u
                      </Typography>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(item.id, item.nombre)}
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))}

            {/* Acciones del carrito */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/productos')}
                startIcon={<ArrowBackIcon />}
              >
                Continuar Comprando
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  clearCart();
                  setSnackbar({
                    open: true,
                    message: 'Carrito limpiado',
                    severity: 'info'
                  });
                }}
              >
                Limpiar Carrito
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Resumen de la orden */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Resumen de la Orden
            </Typography>
            
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography>${subtotal.toFixed(2)}</Typography>
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Envío" 
                  secondary={subtotal > 500 ? 'Gratis en compras >$500' : 'Tarifa estándar'}
                />
                <Typography>
                  {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Impuestos (8%)" />
                <Typography>${tax.toFixed(2)}</Typography>
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={
                    <Typography variant="h6">Total</Typography>
                  } 
                />
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            {shipping > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                ¡Agrega ${(500 - subtotal).toFixed(2)} más para envío gratis!
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              startIcon={<LocalShippingIcon />}
              sx={{ mt: 2 }}
            >
              Proceder al Checkout
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Envío seguro y confiable con TecnoRoute
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
