import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Clientes = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Clientes
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Aquí se gestionarán los clientes del sistema TecnoRoute.
          Esta página incluirá funcionalidades CRUD completas para:
        </Typography>
        <ul>
          <li>Crear nuevos clientes</li>
          <li>Visualizar lista de clientes</li>
          <li>Editar información de clientes</li>
          <li>Activar/desactivar clientes</li>
          <li>Búsqueda y filtros avanzados</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Clientes;
