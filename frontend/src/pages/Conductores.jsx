import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Conductores = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Conductores
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se gestionarán los conductores del sistema TecnoRoute.
          Esta página incluirá funcionalidades CRUD completas para:
        </Typography>
        <ul>
          <li>Registrar nuevos conductores</li>
          <li>Visualizar lista de conductores</li>
          <li>Editar información de conductores</li>
          <li>Cambiar estados (disponible, en ruta, descanso)</li>
          <li>Gestión de licencias y documentos</li>
          <li>Historial de rutas asignadas</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Conductores;
