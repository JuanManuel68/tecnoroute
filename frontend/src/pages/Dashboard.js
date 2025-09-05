import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  People as PeopleIcon,
  DirectionsCar as DirectionsCarIcon,
  Route as RouteIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import apiService from '../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalConductores: 0,
    totalVehiculos: 0,
    totalRutas: 0,
    totalEnvios: 0,
    enviosPendientes: 0,
    enviosEnTransito: 0,
    enviosEntregados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [enviosRecientes, setEnviosRecientes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch basic statistics
        const [
          clientesRes,
          conductoresRes,
          vehiculosRes,
          rutasRes,
          enviosRes,
          enviosPendientesRes,
          enviosTransitoRes,
        ] = await Promise.all([
          apiService.get('/api/clientes/'),
          apiService.get('/api/conductores/'),
          apiService.get('/api/vehiculos/'),
          apiService.get('/api/rutas/'),
          apiService.get('/api/envios/'),
          apiService.get('/api/envios/pendientes/'),
          apiService.get('/api/envios/en_transito/'),
        ]);

        // Calculate delivered shipments
        const enviosEntregados = enviosRes.data.filter(envio => envio.estado === 'entregado').length;

        setStats({
          totalClientes: clientesRes.data.length,
          totalConductores: conductoresRes.data.length,
          totalVehiculos: vehiculosRes.data.length,
          totalRutas: rutasRes.data.length,
          totalEnvios: enviosRes.data.length,
          enviosPendientes: enviosPendientesRes.data.length,
          enviosEnTransito: enviosTransitoRes.data.length,
          enviosEntregados: enviosEntregados,
        });

        // Get recent shipments (last 10)
        const enviosOrdenados = enviosRes.data
          .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
          .slice(0, 10);
        setEnviosRecientes(enviosOrdenados);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'en_transito':
        return 'info';
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClientes,
      icon: <PeopleIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Conductores Activos',
      value: stats.totalConductores,
      icon: <PeopleIcon fontSize="large" />,
      color: '#388e3c',
    },
    {
      title: 'Vehículos Disponibles',
      value: stats.totalVehiculos,
      icon: <DirectionsCarIcon fontSize="large" />,
      color: '#f57c00',
    },
    {
      title: 'Rutas Configuradas',
      value: stats.totalRutas,
      icon: <RouteIcon fontSize="large" />,
      color: '#7b1fa2',
    },
    {
      title: 'Total de Envíos',
      value: stats.totalEnvios,
      icon: <AssignmentIcon fontSize="large" />,
      color: '#303f9f',
    },
    {
      title: 'Envíos Pendientes',
      value: stats.enviosPendientes,
      icon: <WarningIcon fontSize="large" />,
      color: '#f57c00',
    },
    {
      title: 'En Tránsito',
      value: stats.enviosEnTransito,
      icon: <LocalShippingIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Entregados',
      value: stats.enviosEntregados,
      icon: <CheckCircleIcon fontSize="large" />,
      color: '#388e3c',
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Panel de Control - TecnoRoute
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(45deg, ${card.color}22, ${card.color}11)`,
                border: `1px solid ${card.color}33`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, opacity: 0.7 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Shipments */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              Envíos Recientes
            </Typography>
            {enviosRecientes.length > 0 ? (
              <List>
                {enviosRecientes.map((envio) => (
                  <ListItem key={envio.id} divider>
                    <ListItemIcon>
                      <LocalShippingIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${envio.numero_guia} - ${envio.cliente_nombre}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {envio.ruta_info} • {envio.descripcion_carga}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Creado: {new Date(envio.fecha_creacion).toLocaleDateString('es-ES')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={envio.estado.replace('_', ' ').toUpperCase()}
                      color={getEstadoColor(envio.estado)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                No hay envíos recientes para mostrar.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Operaciones
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Estado del Sistema:</strong>
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalClientes} clientes registrados
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalConductores} conductores disponibles
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalVehiculos} vehículos en flota
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalRutas} rutas configuradas
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Envíos del Día:</strong>
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ color: '#f57c00' }}>
                  📋 {stats.enviosPendientes} pendientes
                </Typography>
                <Typography variant="body2" sx={{ color: '#1976d2' }}>
                  🚛 {stats.enviosEnTransito} en tránsito
                </Typography>
                <Typography variant="body2" sx={{ color: '#388e3c' }}>
                  ✅ {stats.enviosEntregados} entregados
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
