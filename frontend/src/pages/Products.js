import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Badge,
  Fab
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Category as CategoryIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const { addToCart, getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Base de datos de productos completa con 25+ productos variados
  useEffect(() => {
    const productosCompletos = [
      // ELECTRODOMÉSTICOS DE COCINA
      {
        id: 1,
        nombre: 'Refrigerador Samsung 500L',
        descripcion: 'Refrigerador doble puerta con dispensador de agua y hielo',
        precio: 1299.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Cocina',
        imagen: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
        stock: 8,
        marca: 'Samsung'
      },
      {
        id: 2,
        nombre: 'Microondas LG 1.5 Cu Ft',
        descripcion: 'Microondas con grill y función de descongelado automático',
        precio: 299.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Cocina',
        imagen: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400',
        stock: 15,
        marca: 'LG'
      },
      {
        id: 3,
        nombre: 'Lavadora Whirlpool 18kg',
        descripcion: 'Lavadora automática con 12 programas de lavado',
        precio: 899.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Lavandería',
        imagen: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
        stock: 6,
        marca: 'Whirlpool'
      },
      {
        id: 4,
        nombre: 'Licuadora Oster Pro',
        descripcion: 'Licuadora de alta potencia con jarra de vidrio',
        precio: 89.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Cocina',
        imagen: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
        stock: 20,
        marca: 'Oster'
      },
      
      // ELECTRÓNICOS
      {
        id: 5,
        nombre: 'Smart TV Samsung 55"',
        descripcion: 'Televisor 4K UHD con Smart TV y HDR',
        precio: 799.99,
        categoria: 'Electrónicos',
        subcategoria: 'Entretenimiento',
        imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        stock: 12,
        marca: 'Samsung'
      },
      {
        id: 6,
        nombre: 'Laptop HP Pavilion',
        descripcion: 'Laptop 15.6" Intel i5, 8GB RAM, 256GB SSD',
        precio: 699.99,
        categoria: 'Electrónicos',
        subcategoria: 'Computadoras',
        imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        stock: 5,
        marca: 'HP'
      },
      {
        id: 7,
        nombre: 'Smartphone iPhone 14',
        descripcion: 'iPhone 14 128GB con cámara avanzada',
        precio: 999.99,
        categoria: 'Electrónicos',
        subcategoria: 'Móviles',
        imagen: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        stock: 10,
        marca: 'Apple'
      },
      {
        id: 8,
        nombre: 'Audífonos Sony WH-1000XM4',
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        precio: 279.99,
        categoria: 'Electrónicos',
        subcategoria: 'Audio',
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        stock: 18,
        marca: 'Sony'
      },
      
      // HOGAR Y DECORACIÓN
      {
        id: 9,
        nombre: 'Sofá Modular 3 Plazas',
        descripcion: 'Sofá cómodo con tapicería de tela gris',
        precio: 899.99,
        categoria: 'Hogar',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        stock: 4,
        marca: 'HomeStyle'
      },
      {
        id: 10,
        nombre: 'Mesa de Comedor Madera',
        descripcion: 'Mesa para 6 personas en madera maciza',
        precio: 549.99,
        categoria: 'Hogar',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
        stock: 7,
        marca: 'WoodCraft'
      },
      {
        id: 11,
        nombre: 'Lámpara de Piso LED',
        descripcion: 'Lámpara moderna con luz LED regulable',
        precio: 129.99,
        categoria: 'Hogar',
        subcategoria: 'Iluminación',
        imagen: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        stock: 14,
        marca: 'LightUp'
      },
      {
        id: 12,
        nombre: 'Aspiradora Robótica',
        descripcion: 'Robot aspiradora con mapeo inteligente',
        precio: 399.99,
        categoria: 'Hogar',
        subcategoria: 'Limpieza',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        stock: 9,
        marca: 'RoboClean'
      },
      
      // DEPORTES Y FITNESS
      {
        id: 13,
        nombre: 'Caminadora Eléctrica',
        descripcion: 'Caminadora plegable con 12 programas de entrenamiento',
        precio: 799.99,
        categoria: 'Deportes',
        subcategoria: 'Fitness',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        stock: 5,
        marca: 'FitPro'
      },
      {
        id: 14,
        nombre: 'Bicicleta Estática',
        descripcion: 'Bicicleta con resistencia magnética y monitor',
        precio: 349.99,
        categoria: 'Deportes',
        subcategoria: 'Fitness',
        imagen: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
        stock: 8,
        marca: 'CycleFit'
      },
      {
        id: 15,
        nombre: 'Set de Pesas Ajustables',
        descripcion: 'Set de mancuernas ajustables de 5-50 lbs',
        precio: 299.99,
        categoria: 'Deportes',
        subcategoria: 'Fitness',
        imagen: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400',
        stock: 12,
        marca: 'PowerLift'
      },
      
      // JARDINERÍA Y EXTERIOR
      {
        id: 16,
        nombre: 'Parrilla de Gas Weber',
        descripcion: 'Parrilla de gas con 3 quemadores y termómetro',
        precio: 599.99,
        categoria: 'Exterior',
        subcategoria: 'Jardín',
        imagen: 'https://images.unsplash.com/photo-1544966503-7ad532c2b48d?w=400',
        stock: 6,
        marca: 'Weber'
      },
      {
        id: 17,
        nombre: 'Set de Muebles Patio',
        descripcion: 'Mesa y 4 sillas para exterior resistentes al clima',
        precio: 449.99,
        categoria: 'Exterior',
        subcategoria: 'Jardín',
        imagen: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
        stock: 8,
        marca: 'OutdoorLife'
      },
      {
        id: 18,
        nombre: 'Cortadora de Césped',
        descripcion: 'Podadora eléctrica con bolsa recolectora',
        precio: 279.99,
        categoria: 'Exterior',
        subcategoria: 'Jardín',
        imagen: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        stock: 10,
        marca: 'GreenCut'
      },
      
      // AUTOMÓVIL Y HERRAMIENTAS
      {
        id: 19,
        nombre: 'Taladro Inalámbrico DeWalt',
        descripcion: 'Taladro de 20V con batería y cargador',
        precio: 159.99,
        categoria: 'Herramientas',
        subcategoria: 'Eléctricas',
        imagen: 'https://images.unsplash.com/photo-1504148455328-d24b4cea4045?w=400',
        stock: 15,
        marca: 'DeWalt'
      },
      {
        id: 20,
        nombre: 'Compresor de Aire',
        descripcion: 'Compresor portátil de 6 galones',
        precio: 189.99,
        categoria: 'Herramientas',
        subcategoria: 'Neumáticas',
        imagen: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
        stock: 11,
        marca: 'AirMax'
      },
      
      // BELLEZA Y CUIDADO PERSONAL
      {
        id: 21,
        nombre: 'Secador de Cabello Profesional',
        descripcion: 'Secador con tecnología de iones negativos',
        precio: 89.99,
        categoria: 'Belleza',
        subcategoria: 'Cuidado Capilar',
        imagen: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400',
        stock: 20,
        marca: 'BeautyPro'
      },
      {
        id: 22,
        nombre: 'Plancha de Cabello Cerámica',
        descripcion: 'Plancha profesional con placas de cerámica',
        precio: 79.99,
        categoria: 'Belleza',
        subcategoria: 'Cuidado Capilar',
        imagen: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        stock: 16,
        marca: 'StyleMax'
      },
      
      // MASCOTAS
      {
        id: 23,
        nombre: 'Casa para Perro Grande',
        descripcion: 'Casa resistente al clima para perros grandes',
        precio: 199.99,
        categoria: 'Mascotas',
        subcategoria: 'Accesorios',
        imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
        stock: 7,
        marca: 'PetHome'
      },
      {
        id: 24,
        nombre: 'Fuente de Agua Automática',
        descripcion: 'Dispensador de agua con filtro para mascotas',
        precio: 49.99,
        categoria: 'Mascotas',
        subcategoria: 'Alimentación',
        imagen: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        stock: 25,
        marca: 'AquaPet'
      },
      
      // OFICINA Y ESTUDIO
      {
        id: 25,
        nombre: 'Escritorio de Oficina',
        descripcion: 'Escritorio ergonómico con cajones',
        precio: 299.99,
        categoria: 'Oficina',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400',
        stock: 12,
        marca: 'OfficeMax'
      },
      {
        id: 26,
        nombre: 'Silla Ergonómica',
        descripcion: 'Silla de oficina con soporte lumbar',
        precio: 249.99,
        categoria: 'Oficina',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400',
        stock: 18,
        marca: 'ErgoChair'
      }
    ];
    
    setProductos(productosCompletos);
    setFilteredProducts(productosCompletos);
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = productos;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, productos]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.nombre} agregado al carrito`,
      severity: 'success'
    });
  };

  const getCategorias = () => {
    return [...new Set(productos.map(p => p.categoria))];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🛍️ Tienda TecnoRoute
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Todo lo que necesitas para tu hogar y más
        </Typography>
      </Box>

      {/* Filtros */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar productos..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Categoría"
            startAdornment={<CategoryIcon />}
          >
            <MenuItem value="">Todas las categorías</MenuItem>
            {getCategorias().map(categoria => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} productos encontrados
        </Typography>
      </Box>

      {/* Grid de Productos */}
      <Grid container spacing={3}>
        {filteredProducts.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={producto.imagen}
                alt={producto.nombre}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip 
                    label={producto.categoria} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {producto.marca}
                  </Typography>
                </Box>
                
                <Typography gutterBottom variant="h6" component="h2" sx={{ minHeight: 48 }}>
                  {producto.nombre}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {producto.descripcion}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${producto.precio}
                  </Typography>
                  <Typography variant="body2" color={producto.stock < 5 ? 'error' : 'success.main'}>
                    {producto.stock} disponibles
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCart(producto)}
                  disabled={producto.stock === 0}
                  color={producto.stock < 5 ? 'warning' : 'primary'}
                >
                  {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Cart Button */}
      <Fab
        color="secondary"
        aria-label="ver carrito"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/cart')}
      >
        <Badge badgeContent={getCartItemsCount()} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default Products;
