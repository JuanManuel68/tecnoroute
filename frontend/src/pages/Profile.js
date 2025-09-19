import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Colombia'
    },
    paymentMethod: 'credit_card',
    avatar: user?.avatar || ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'La imagen debe ser menor a 5MB',
          severity: 'error'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatarPreview(base64);
        setProfileData(prev => ({
          ...prev,
          avatar: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setConfirmDialog(true);
  };

  const confirmSave = async () => {
    try {
      // Aquí normalmente harías una llamada al API
      // await updateUserProfile(profileData);
      
      // Por ahora simularemos la actualización
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        profile: {
          phone: profileData.phone,
          address: profileData.address,
          paymentMethod: profileData.paymentMethod
        }
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEditing(false);
      setConfirmDialog(false);
      setSnackbar({
        open: true,
        message: 'Perfil actualizado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el perfil',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || {
        street: '',
        city: '',
        postalCode: '',
        country: 'Colombia'
      },
      paymentMethod: user?.profile?.paymentMethod || 'credit_card',
      avatar: user?.avatar || ''
    });
    setAvatarPreview(user?.avatar || '');
    setEditing(false);
  };

  const paymentMethods = [
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'debit_card', label: 'Tarjeta de Débito' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Transferencia Bancaria' },
    { value: 'cash', label: 'Pago Contraentrega' }
  ];

  const countries = [
    'Colombia', 'México', 'España', 'Argentina', 'Chile', 'Perú', 'Venezuela'
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PersonIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Mi Perfil
        </Typography>
        {!editing && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
            sx={{ ml: 'auto' }}
          >
            Editar Perfil
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Información Personal */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                >
                  {profileData.name.charAt(0).toUpperCase()}
                </Avatar>
                {editing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />

              <Typography variant="h5" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Miembro desde {new Date().toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulario de Datos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Nombre completo */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editing}
                  placeholder="+57 300 123 4567"
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Dirección */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1 }} />
                  Dirección Principal
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Calle y Número"
                  value={profileData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  disabled={!editing}
                  placeholder="Carrera 15 #123-45"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={profileData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  disabled={!editing}
                  placeholder="Bogotá"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  value={profileData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  disabled={!editing}
                  placeholder="110111"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth disabled={!editing}>
                  <InputLabel>País</InputLabel>
                  <Select
                    value={profileData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    label="País"
                  >
                    {countries.map(country => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Método de pago */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PaymentIcon sx={{ mr: 1 }} />
                  Método de Pago Preferido
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth disabled={!editing}>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={profileData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    label="Método de Pago"
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Botones de acción */}
            {editing && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Guardar Cambios
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de confirmación */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirmar Cambios</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres guardar los cambios en tu perfil?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmSave} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
