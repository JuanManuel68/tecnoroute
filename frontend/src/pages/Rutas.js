import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Rutas = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Rutas
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se gestionarán las rutas de transporte del sistema TecnoRoute.
          Esta página incluirá funcionalidades CRUD completas para:
        </Typography>
        <ul>
          <li>Crear nuevas rutas</li>
          <li>Visualizar todas las rutas</li>
          <li>Editar información de rutas</li>
          <li>Calcular distancias y tiempos</li>
          <li>Gestión de costos de combustible y peajes</li>
          <li>Estados de rutas (planificada, en progreso, completada)</li>
          <li>Optimización de rutas</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Rutas;
