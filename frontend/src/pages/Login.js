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
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { LocalShipping as LocalShippingIcon, AdminPanelSettings as AdminIcon, Person as UserIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type'); // 'admin' o 'user'

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Intentar login con la nueva API de MongoDB
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
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
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (error) {
      console.warn('Nueva API no disponible, usando fallback:', error);
      
      // Fallback al método original
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/productos');
        }
      } else {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    // Auto login después de un pequeño delay para mostrar los datos
    setTimeout(() => {
      handleLogin({ preventDefault: () => {} });
    }, 500);
  };

  const demoCredentials = [
    { 
      email: 'admin@tecnoroute.com', 
      password: 'admin123', 
      role: 'Administrador', 
      description: 'Panel administrativo completo',
      icon: <AdminIcon color="primary" />
    },
    { 
      email: 'usuario@tecnoroute.com', 
      password: 'user123', 
      role: 'Usuario Cliente', 
      description: 'Tienda de electrodomésticos',
      icon: <UserIcon color="secondary" />
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'grey.100',
      pt: 10, // Account for navbar
      pb: 4
    }}>
      <Container component="main" maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocalShippingIcon sx={{ fontSize: 60, color: '#616161', mb: 2 }} />
          <Typography component="h1" variant="h3" color="primary" sx={{ color: '#424242' }}>
            {loginType === 'user' ? '🛒 Tienda TecnoRoute' : '🔐 Iniciar Sesión'}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {loginType === 'user' 
              ? 'Accede para ver nuestros electrodomésticos'
              : 'Accede a tu cuenta de TecnoRoute'
            }
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Formulario de Login */}
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ p: 4 }}>
              <Typography component="h2" variant="h4" align="center" gutterBottom>
                Iniciar Sesión
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                
                <Divider sx={{ my: 2 }} />
                
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ¿No tienes cuenta?
                  </Typography>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                  >
                    Regístrate aquí
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Credenciales de demo */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🧪 Cuentas de Prueba
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Usa estas credenciales para probar el sistema:
                </Typography>
                
                {demoCredentials.map((cred, index) => (
                  <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {cred.icon}
                        <Typography variant="subtitle1" sx={{ ml: 1 }} color="primary">
                          {cred.role}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {cred.email}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Contraseña:</strong> {cred.password}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        {cred.description}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={() => handleQuickLogin(cred.email, cred.password)}
                      >
                        Acceso Rápido
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> El administrador accede al panel de gestión, 
                    el usuario accede a la tienda de electrodomésticos.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
