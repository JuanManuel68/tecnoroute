import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Envios = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Envíos
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se gestionarán los envíos del sistema TecnoRoute.
          Esta página incluirá funcionalidades CRUD completas para:
        </Typography>
        <ul>
          <li>Crear nuevos envíos</li>
          <li>Visualizar lista de envíos</li>
          <li>Editar información de envíos</li>
          <li>Asignar vehículos y conductores</li>
          <li>Control de estados (pendiente, en tránsito, entregado)</li>
          <li>Gestión de fechas de recogida y entrega</li>
          <li>Cálculo de costos</li>
          <li>Generación de guías de envío</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Envios;
