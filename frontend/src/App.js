import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PublicNavbar from './components/PublicNavbar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import PedidosAdmin from './pages/PedidosAdmin';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Conductores from './pages/Conductores';
import Vehiculos from './pages/Vehiculos';
import Rutas from './pages/Rutas';
import Envios from './pages/Envios';
import SeguimientoEnvio from './pages/SeguimientoEnvio';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Componente para rutas protegidas de usuario
const UserRoute = ({ children }) => {
  const { isAuthenticated, isUser, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login?type=user" replace />;
  }
  
  return isUser() ? children : <Navigate to="/admin" replace />;
};

// Componente para rutas protegidas de administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login?type=admin" replace />;
  }
  
  return isAdmin() ? children : <Navigate to="/productos" replace />;
};

// Componente principal de la aplicación
const AppContent = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando aplicación...</div>;
  }
  
  return (
    <div className="App">
      {/* Mostrar navbar según el estado de autenticación */}
      {isAuthenticated && isAdmin() ? (
        <Navbar />
      ) : (
        <PublicNavbar />
      )}
      
      <main style={{ 
        marginTop: '64px', // Siempre hay navbar
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/productos" replace />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/productos" replace /> : <Register />} 
          />
          
          {/* Rutas de usuario (tienda) */}
          <Route path="/productos" element={
            <UserRoute>
              <Products />
            </UserRoute>
          } />
          <Route path="/cart" element={
            <UserRoute>
              <Cart />
            </UserRoute>
          } />
          <Route path="/profile" element={
            <UserRoute>
              <Profile />
            </UserRoute>
          } />
          <Route path="/checkout" element={
            <UserRoute>
              <Checkout />
            </UserRoute>
          } />
          <Route path="/orders" element={
            <UserRoute>
              <Orders />
            </UserRoute>
          } />
          
          {/* Rutas de administrador */}
          <Route path="/admin" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Dashboard />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/clientes" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Clientes />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/conductores" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Conductores />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/vehiculos" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Vehiculos />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/rutas" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Rutas />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/envios" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <Envios />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/seguimiento" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <SeguimientoEnvio />
              </div>
            </AdminRoute>
          } />
          <Route path="/admin/pedidos" element={
            <AdminRoute>
              <div style={{padding: '20px'}}>
                <PedidosAdmin />
              </div>
            </AdminRoute>
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
