import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Schedule,
} from '@mui/icons-material';

const Contact = () => {
  return (
    <Box sx={{ pt: 10, pb: 4, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Contáctanos
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Estamos aquí para ayudarte con cualquier consulta
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Envíanos un mensaje
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nombre" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" type="email" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Asunto" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Mensaje"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" size="large">
                      Enviar Mensaje
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Contacto
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Teléfono"
                      secondary="+1 (555) 123-4567"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary="contacto@tecnoroute.com"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dirección"
                      secondary="123 Calle Principal, Ciudad, País"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Horarios"
                      secondary="Lun - Vie: 8:00 - 18:00"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
