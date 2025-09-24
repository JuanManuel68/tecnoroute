import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const SeguimientoEnvio = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Seguimiento de Envíos
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se realizará el seguimiento de los envíos del sistema TecnoRoute.
          Esta página incluirá funcionalidades para:
        </Typography>
        <ul>
          <li>Búsqueda por número de guía</li>
          <li>Visualizar historial completo de seguimiento</li>
          <li>Estados en tiempo real</li>
          <li>Ubicación actual del envío</li>
          <li>Fechas estimadas vs reales</li>
          <li>Notificaciones de estado</li>
          <li>Comunicación con cliente</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default SeguimientoEnvio;
