import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  LocalShipping,
  Security,
  Speed,
  Store,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const servicios = [
    {
      titulo: 'Transporte Rápido',
      descripcion: 'Entrega en tiempo record con nuestro sistema de logística avanzado',
      icono: <Speed sx={{ fontSize: 50, color: '#616161' }} />
    },
    {
      titulo: 'Seguridad Garantizada',
      descripcion: 'Tus productos están protegidos durante todo el proceso de entrega',
      icono: <Security sx={{ fontSize: 50, color: '#616161' }} />
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #424242 0%, #616161 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <LocalShipping sx={{ fontSize: 100, mb: 3 }} />
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a TecnoRoute
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            La plataforma líder en logística y distribución de electrodomésticos
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem' }}>
            Conectamos fabricantes, distribuidores y consumidores a través de nuestra 
            avanzada red de transporte y logística especializada en electrodomésticos.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Store />}
              onClick={() => navigate('/login?type=user')}
              sx={{ minWidth: 200 }}
            >
              Ver Productos
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ minWidth: 200 }}
            >
              Registrarse
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Servicios Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, color: '#424242' }}>
          Nuestros Servicios
        </Typography>
        
        <Grid container spacing={4}>
          {servicios.map((servicio, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ textAlign: 'center', height: '100%', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {servicio.icono}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {servicio.titulo}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {servicio.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sobre Nosotros Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom sx={{ color: '#424242' }}>
                Sobre TecnoRoute
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Somos una empresa líder en logística especializada en la distribución 
                de electrodomésticos. Con más de 10 años de experiencia, hemos desarrollado 
                una red de transporte eficiente y confiable.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Nuestro sistema integrado permite a los usuarios encontrar los mejores 
                electrodomésticos y recibirlos en la comodidad de su hogar, mientras 
                que los administradores pueden gestionar eficientemente toda la operación.
              </Typography>
              
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ¿Por qué elegir TecnoRoute?
                </Typography>
                <Typography variant="body1">
                  • Seguimiento en tiempo real<br/>
                  • Entrega programada<br/>
                  • Múltiples formas de pago<br/>
                  • Garantía de satisfacción<br/>
                  • Red de distribución nacional<br/>
                  • Tecnología de vanguardia
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Estadísticas */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, color: '#424242' }}>
          Confían en Nosotros
        </Typography>
        
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h2" sx={{ color: '#616161' }} gutterBottom>
              10K+
            </Typography>
            <Typography variant="h6">
              Productos Entregados
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h2" sx={{ color: '#616161' }} gutterBottom>
              500+
            </Typography>
            <Typography variant="h6">
              Clientes Satisfechos
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h2" sx={{ color: '#616161' }} gutterBottom>
              24/7
            </Typography>
            <Typography variant="h6">
              Soporte al Cliente
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;