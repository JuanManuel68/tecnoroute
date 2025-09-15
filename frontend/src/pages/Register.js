import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  FormControlLabel,
  Checkbox,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Colombia'
    },
    paymentMethod: 'credit_card'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!formData.phone || !formData.address.street || !formData.address.city) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    // Registrar con todos los datos
    const result = await register(formData);
    
    if (result.success) {
      // Los nuevos usuarios siempre son 'user', así que van a productos
      navigate('/productos');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'grey.100',
      pt: 10,
      pb: 4,
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h3" color="primary">
              Registrarse
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Crea tu cuenta en TecnoRoute
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nombre Completo / Razón Social"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  helperText="Mínimo 6 caracteres"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              
              {/* Dirección */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Dirección Principal
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address.street"
                  label="Calle y Número"
                  placeholder="Carrera 15 #123-45"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="address.city"
                  label="Ciudad"
                  placeholder="Bogotá"
                  value={formData.address.city}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="address.postalCode"
                  label="Código Postal"
                  placeholder="110111"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>País</InputLabel>
                  <Select
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    label="País"
                  >
                    <MenuItem value="Colombia">Colombia</MenuItem>
                    <MenuItem value="México">México</MenuItem>
                    <MenuItem value="España">España</MenuItem>
                    <MenuItem value="Argentina">Argentina</MenuItem>
                    <MenuItem value="Chile">Chile</MenuItem>
                    <MenuItem value="Perú">Perú</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Método de pago */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                  Método de Pago Preferido
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    label="Método de Pago"
                  >
                    <MenuItem value="credit_card">Tarjeta de Crédito</MenuItem>
                    <MenuItem value="debit_card">Tarjeta de Débito</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
                    <MenuItem value="cash">Pago Contraentrega</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link href="#" color="primary">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" color="primary">
                    política de privacidad
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
            
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ¿Ya tienes cuenta?
              </Typography>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate('/login')}
              >
                Inicia sesión aquí
              </Link>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> Al registrarte tendrás acceso a nuestra tienda de 
              electrodomésticos con entrega a domicilio.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
