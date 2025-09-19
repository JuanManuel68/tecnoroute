import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  Route as RouteIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderComplete, setOrderComplete] = useState(false);

  // Datos del formulario
  const [orderData, setOrderData] = useState({
    conductor: '',
    vehiculo: '',
    tipoServicio: '',
    ruta: '',
    fechaEntrega: '',
    horaEntrega: '',
    instruccionesEspeciales: ''
  });

  // Mock data para los selects
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    // Simular carga de datos desde el backend
    setConductores([
      { id: 1, nombre: 'Juan Carlos Pérez', cedula: '12345678', telefono: '+57 300 123 4567', rating: 4.8 },
      { id: 2, nombre: 'María Fernanda López', cedula: '87654321', telefono: '+57 301 234 5678', rating: 4.9 },
      { id: 3, nombre: 'Carlos Eduardo Martín', cedula: '11223344', telefono: '+57 302 345 6789', rating: 4.7 },
      { id: 4, nombre: 'Ana Isabel García', cedula: '44332211', telefono: '+57 303 456 7890', rating: 4.6 },
      { id: 5, nombre: 'Roberto José Silva', cedula: '55667788', telefono: '+57 304 567 8901', rating: 4.8 }
    ]);

    setVehiculos([
      { id: 1, tipo: 'Motocicleta', marca: 'Honda CB 150', placa: 'ABC-123', capacidad: '50kg' },
      { id: 2, tipo: 'Camioneta', marca: 'Chevrolet LUV D-MAX', placa: 'DEF-456', capacidad: '1000kg' },
      { id: 3, tipo: 'Camión', marca: 'Volvo FH 460', placa: 'GHI-789', capacidad: '5000kg' },
      { id: 4, tipo: 'Furgón', marca: 'Mercedes Sprinter', placa: 'JKL-012', capacidad: '2000kg' },
      { id: 5, tipo: 'Camión Grande', marca: 'Kenworth T800', placa: 'MNO-345', capacidad: '15000kg' }
    ]);

    setRutas([
      { id: 1, nombre: 'Bogotá - Medellín', distancia: '415 km', tiempo: '7 horas', precio: 180.00 },
      { id: 2, nombre: 'Bogotá - Cali', distancia: '456 km', tiempo: '8 horas', precio: 200.00 },
      { id: 3, nombre: 'Bogotá - Barranquilla', distancia: '945 km', tiempo: '14 horas', precio: 350.00 },
      { id: 4, nombre: 'Medellín - Cali', distancia: '368 km', tiempo: '6 horas', precio: 160.00 },
      { id: 5, nombre: 'Bogotá - Bucaramanga', distancia: '364 km', tiempo: '6.5 horas', precio: 170.00 },
      { id: 6, nombre: 'Zona Urbana Bogotá', distancia: '0-50 km', tiempo: '1-3 horas', precio: 25.00 }
    ]);
  }, []);

  const steps = ['Seleccionar Conductor', 'Elegir Vehículo', 'Configurar Envío', 'Confirmar Pedido'];

  const tiposServicio = [
    { value: 'paqueteria', label: 'Paquetería', description: 'Envíos pequeños y medianos, hasta 50kg' },
    { value: 'carga_pesada', label: 'Carga Pesada', description: 'Transporte de mercancía pesada, más de 50kg' },
    { value: 'logistica_empresarial', label: 'Logística Empresarial', description: 'Servicios especializados para empresas' },
    { value: 'express', label: 'Express', description: 'Entrega rápida en el mismo día' }
  ];

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!orderData.conductor) {
          setSnackbar({ open: true, message: 'Selecciona un conductor', severity: 'warning' });
          return false;
        }
        break;
      case 1:
        if (!orderData.vehiculo) {
          setSnackbar({ open: true, message: 'Selecciona un vehículo', severity: 'warning' });
          return false;
        }
        break;
      case 2:
        if (!orderData.tipoServicio || !orderData.ruta) {
          setSnackbar({ open: true, message: 'Completa todos los campos requeridos', severity: 'warning' });
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      // Simular envío al backend
      const orderPayload = {
        usuario: user,
        productos: cartItems,
        conductor: conductores.find(c => c.id === orderData.conductor),
        vehiculo: vehiculos.find(v => v.id === orderData.vehiculo),
        tipoServicio: orderData.tipoServicio,
        ruta: rutas.find(r => r.id === orderData.ruta),
        fechaEntrega: orderData.fechaEntrega,
        horaEntrega: orderData.horaEntrega,
        instruccionesEspeciales: orderData.instruccionesEspeciales,
        subtotal: getCartTotal(),
        total: calculateTotal(),
        timestamp: new Date().toISOString(),
        numeroOrden: `TEC-${Date.now()}`
      };

      // Guardar en localStorage para simulación (en producción iría al backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderPayload);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      setTimeout(() => {
        setLoading(false);
        setOrderComplete(true);
        clearCart();
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Error al procesar el pedido. Intenta nuevamente.',
        severity: 'error'
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = getCartTotal();
    const shipping = rutas.find(r => r.id === orderData.ruta)?.precio || 0;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Selecciona tu conductor preferido
              </Typography>
            </Grid>
            {conductores.map((conductor) => (
              <Grid item xs={12} md={6} key={conductor.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: orderData.conductor === conductor.id ? '2px solid' : '1px solid',
                    borderColor: orderData.conductor === conductor.id ? 'primary.main' : 'grey.300',
                    '&:hover': { elevation: 4 }
                  }}
                  onClick={() => handleInputChange('conductor', conductor.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">{conductor.nombre}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Cédula: {conductor.cedula}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teléfono: {conductor.telefono}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Rating: ⭐ {conductor.rating}/5
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Elige el vehículo adecuado para tu envío
              </Typography>
            </Grid>
            {vehiculos.map((vehiculo) => (
              <Grid item xs={12} md={6} key={vehiculo.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: orderData.vehiculo === vehiculo.id ? '2px solid' : '1px solid',
                    borderColor: orderData.vehiculo === vehiculo.id ? 'primary.main' : 'grey.300',
                    '&:hover': { elevation: 4 }
                  }}
                  onClick={() => handleInputChange('vehiculo', vehiculo.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">{vehiculo.tipo}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {vehiculo.marca}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placa: {vehiculo.placa}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Capacidad: {vehiculo.capacidad}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configura los detalles de tu envío
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Tipo de Servicio
              </Typography>
              <RadioGroup
                value={orderData.tipoServicio}
                onChange={(e) => handleInputChange('tipoServicio', e.target.value)}
              >
                {tiposServicio.map((servicio) => (
                  <FormControlLabel
                    key={servicio.value}
                    value={servicio.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1">{servicio.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {servicio.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Ruta de Envío</InputLabel>
                <Select
                  value={orderData.ruta}
                  onChange={(e) => handleInputChange('ruta', e.target.value)}
                  label="Ruta de Envío"
                  startAdornment={<RouteIcon sx={{ mr: 1 }} />}
                >
                  {rutas.map((ruta) => (
                    <MenuItem key={ruta.id} value={ruta.id}>
                      <Box>
                        <Typography variant="body1">{ruta.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ruta.distancia} - {ruta.tiempo} - ${ruta.precio}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Entrega"
                value={orderData.fechaEntrega}
                onChange={(e) => handleInputChange('fechaEntrega', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Hora de Entrega"
                value={orderData.horaEntrega}
                onChange={(e) => handleInputChange('horaEntrega', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Instrucciones Especiales (Opcional)"
                value={orderData.instruccionesEspeciales}
                onChange={(e) => handleInputChange('instruccionesEspeciales', e.target.value)}
                placeholder="Agrega cualquier instrucción especial para la entrega..."
              />
            </Grid>
          </Grid>
        );

      case 3:
        const selectedConductor = conductores.find(c => c.id === orderData.conductor);
        const selectedVehiculo = vehiculos.find(v => v.id === orderData.vehiculo);
        const selectedRuta = rutas.find(r => r.id === orderData.ruta);
        const selectedServicio = tiposServicio.find(s => s.value === orderData.tipoServicio);

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Confirma los detalles de tu pedido
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Productos</Typography>
                  <List dense>
                    {cartItems.map((item) => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${item.nombre} x${item.quantity}`}
                          secondary={`$${(item.precio * item.quantity).toFixed(2)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Detalles del Envío</Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Conductor:</strong> {selectedConductor?.nombre}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Vehículo:</strong> {selectedVehiculo?.tipo} - {selectedVehiculo?.marca}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Servicio:</strong> {selectedServicio?.label}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Ruta:</strong> {selectedRuta?.nombre}
                  </Typography>
                  {orderData.fechaEntrega && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Entrega:</strong> {orderData.fechaEntrega} {orderData.horaEntrega}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Resumen de Costos</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${getCartTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Envío:</Typography>
                  <Typography>${selectedRuta?.precio.toFixed(2) || '0.00'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Impuestos (8%):</Typography>
                  <Typography>${(getCartTotal() * 0.08).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No hay productos en el carrito
        </Typography>
        <Button onClick={() => navigate('/productos')} variant="contained">
          Ir a Comprar
        </Button>
      </Container>
    );
  }

  if (orderComplete) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            ¡Pedido Confirmado!
          </Typography>
          <Typography variant="body1" paragraph>
            Tu pedido ha sido enviado exitosamente. Recibirás un email de confirmación shortly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button onClick={() => navigate('/productos')} variant="contained">
              Continuar Comprando
            </Button>
            <Button onClick={() => navigate('/profile')} variant="outlined">
              Ver Mi Perfil
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')}>
          Volver al Carrito
        </Button>
        <Typography variant="h4" sx={{ ml: 2 }}>
          Checkout
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Paper sx={{ p: 4 }}>
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Anterior
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmitOrder}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LocalShippingIcon />}
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default Checkout;
