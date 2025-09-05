import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ marginTop: '80px', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/conductores" element={<Conductores />} />
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/envios" element={<Envios />} />
              <Route path="/seguimiento/:numeroGuia" element={<SeguimientoEnvio />} />
              <Route path="/seguimiento" element={<SeguimientoEnvio />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
