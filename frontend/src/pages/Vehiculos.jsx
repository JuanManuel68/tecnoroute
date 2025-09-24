import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Vehiculos = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Vehículos
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se gestionará la flota de vehículos del sistema TecnoRoute.
          Esta página incluirá funcionalidades CRUD completas para:
        </Typography>
        <ul>
          <li>Registrar nuevos vehículos</li>
          <li>Visualizar flota completa</li>
          <li>Editar especificaciones técnicas</li>
          <li>Control de estados (disponible, en uso, mantenimiento)</li>
          <li>Gestión de capacidades de carga</li>
          <li>Historial de mantenimientos</li>
          <li>Asignación a rutas y conductores</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Vehiculos;
