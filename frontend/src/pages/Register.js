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
  Card,
  CardContent,
} from '@mui/material';
import { PersonAdd as PersonAddIcon, AdminPanelSettings as AdminIcon, DirectionsCar as DriverIcon, Person as ClientIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'cliente', // Por defecto cliente
    // Campos específicos por rol
    // Cliente
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    tipo_cliente: 'individual',
    documento_identidad: '',
    // Conductor
    cedula: '',
    licencia: '',
    categoria_licencia: 'B1',
    fecha_vencimiento_licencia: '',
    fecha_nacimiento: '',
    fecha_contratacion: '',
    experiencia_años: 0,
    // Admin
    departamento: 'General'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
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

    // Validaciones específicas por rol
    let requiredFields = ['nombre', 'email', 'telefono', 'password'];
    
    if (formData.rol === 'cliente') {
      requiredFields = [...requiredFields, 'direccion', 'ciudad', 'codigo_postal'];
    } else if (formData.rol === 'conductor') {
      requiredFields = [...requiredFields, 'cedula', 'licencia', 'categoria_licencia', 
                       'fecha_vencimiento_licencia', 'direccion', 'fecha_nacimiento', 'fecha_contratacion'];
    }

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`El campo ${field.replace('_', ' ')} es obligatorio`);
        setLoading(false);
        return;
      }
    }

    try {
      // Intentar registro con la nueva API de MongoDB
      const response = await fetch('http://localhost:8000/api/auth/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y usuario en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        // Redirigir según el rol
        if (data.usuario.rol === 'admin') {
          navigate('/admin');
        } else if (data.usuario.rol === 'conductor') {
          navigate('/conductor'); // Puedes crear esta ruta después
        } else {
          navigate('/productos');
        }
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (error) {
      console.warn('API not available, using fallback:', error);
      
      // Fallback usando el método original
      const result = await register(formData);
      
      if (result.success) {
        navigate('/productos');
      } else {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  // Función para renderizar campos específicos del rol
  const renderRoleSpecificFields = () => {
    switch (formData.rol) {
      case 'cliente':
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                📍 Información de Ubicación
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="direccion"
                label="Dirección Completa"
                placeholder="Carrera 15 #123-45"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="ciudad"
                label="Ciudad"
                placeholder="Bogotá"
                value={formData.ciudad}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="codigo_postal"
                label="Código Postal"
                placeholder="110111"
                value={formData.codigo_postal}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Cliente</InputLabel>
                <Select
                  name="tipo_cliente"
                  value={formData.tipo_cliente}
                  onChange={handleInputChange}
                  label="Tipo de Cliente"
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="empresa">Empresa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="documento_identidad"
                label="Documento de Identidad"
                placeholder="12345678 o NIT"
                value={formData.documento_identidad}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        );
        
      case 'conductor':
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                🚛 Información del Conductor
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="cedula"
                label="Número de Cédula"
                placeholder="12345678"
                value={formData.cedula}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="licencia"
                label="Número de Licencia"
                placeholder="LIC123456789"
                value={formData.licencia}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría de Licencia</InputLabel>
                <Select
                  name="categoria_licencia"
                  value={formData.categoria_licencia}
                  onChange={handleInputChange}
                  label="Categoría de Licencia"
                >
                  <MenuItem value="A1">A1 - Motocicleta</MenuItem>
                  <MenuItem value="A2">A2 - Motocicleta alta cilindrada</MenuItem>
                  <MenuItem value="B1">B1 - Automóvil</MenuItem>
                  <MenuItem value="B2">B2 - Camioneta</MenuItem>
                  <MenuItem value="B3">B3 - Microbús</MenuItem>
                  <MenuItem value="C1">C1 - Camión rígido</MenuItem>
                  <MenuItem value="C2">C2 - Camión articulado</MenuItem>
                  <MenuItem value="C3">C3 - Camión especial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="fecha_vencimiento_licencia"
                label="Vencimiento de Licencia"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_vencimiento_licencia}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="direccion"
                label="Dirección de Residencia"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="fecha_contratacion"
                label="Fecha de Contratación"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_contratacion}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="experiencia_años"
                label="Años de Experiencia"
                type="number"
                value={formData.experiencia_años}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 50 }}
              />
            </Grid>
          </>
        );
        
      case 'admin':
        return (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                👤 Información del Administrador
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="departamento"
                label="Departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                placeholder="Ej: Logística, Ventas, IT"
              />
            </Grid>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'grey.100',
      pt: 10,
      pb: 4,
    }}>
      <Container component="main" maxWidth="md">
        <Paper elevation={6} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonAddIcon sx={{ fontSize: 60, color: '#616161', mb: 2 }} />
            <Typography component="h1" variant="h3" sx={{ color: '#424242' }}>
              Registrarse en TecnoRoute
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Crea tu cuenta según tu rol
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>
            <Grid container spacing={2}>
              {/* Selección de Rol */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  👥 Selecciona tu Rol
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { value: 'cliente', label: 'Cliente', icon: <ClientIcon />, description: 'Solicitar servicios de transporte' },
                    { value: 'conductor', label: 'Conductor', icon: <DriverIcon />, description: 'Operar vehículos de transporte' },
                    { value: 'admin', label: 'Administrador', icon: <AdminIcon />, description: 'Gestionar el sistema' }
                  ].map((rol) => (
                    <Grid item xs={12} sm={4} key={rol.value}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer', 
                          border: formData.rol === rol.value ? 2 : 1,
                          borderColor: formData.rol === rol.value ? '#616161' : 'grey.300',
                          bgcolor: formData.rol === rol.value ? '#9e9e9e' : 'white',
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, rol: rol.value }))}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          {rol.icon}
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {rol.label}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {rol.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Campos básicos */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  📋 Información Básica
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre Completo"
                  name="nombre"
                  autoComplete="name"
                  autoFocus
                  value={formData.nombre}
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
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  autoComplete="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.telefono}
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

              {/* Campos específicos del rol */}
              {renderRoleSpecificFields()}
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
              size="large"
            >
              {loading ? 'Creando cuenta...' : `Registrarse como ${formData.rol}`}
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
              <strong>Nota:</strong> Según tu rol tendrás acceso a diferentes funcionalidades:
              <br />• <strong>Cliente:</strong> Solicitar y seguir envíos
              <br />• <strong>Conductor:</strong> Recibir y gestionar asignaciones
              <br />• <strong>Administrador:</strong> Gestión completa del sistema
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;