import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid,
  ShoppingCartIcon as CartSolid
} from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ModernProducts = () => {
  const { addToCart, getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Base de datos de productos completa
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
        imagen: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop',
        stock: 8,
        marca: 'Samsung',
        rating: 4.5,
        descuento: 10
      },
      {
        id: 2,
        nombre: 'Microondas LG 1.5 Cu Ft',
        descripcion: 'Microondas con grill y función de descongelado automático',
        precio: 299.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Cocina',
        imagen: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=400&fit=crop',
        stock: 15,
        marca: 'LG',
        rating: 4.2,
        descuento: 0
      },
      {
        id: 3,
        nombre: 'Lavadora Whirlpool 18kg',
        descripcion: 'Lavadora automática con 12 programas de lavado',
        precio: 899.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Lavandería',
        imagen: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=400&fit=crop',
        stock: 6,
        marca: 'Whirlpool',
        rating: 4.7,
        descuento: 15
      },
      {
        id: 4,
        nombre: 'Licuadora Oster Pro',
        descripcion: 'Licuadora de alta potencia con jarra de vidrio',
        precio: 89.99,
        categoria: 'Electrodomésticos',
        subcategoria: 'Cocina',
        imagen: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=400&fit=crop',
        stock: 20,
        marca: 'Oster',
        rating: 4.0,
        descuento: 0
      },
      // ELECTRÓNICOS
      {
        id: 5,
        nombre: 'Smart TV Samsung 55"',
        descripcion: 'Televisor 4K UHD con Smart TV y HDR',
        precio: 799.99,
        categoria: 'Electrónicos',
        subcategoria: 'Entretenimiento',
        imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=400&fit=crop',
        stock: 12,
        marca: 'Samsung',
        rating: 4.6,
        descuento: 20
      },
      {
        id: 6,
        nombre: 'Laptop HP Pavilion',
        descripcion: 'Laptop 15.6" Intel i5, 8GB RAM, 256GB SSD',
        precio: 699.99,
        categoria: 'Electrónicos',
        subcategoria: 'Computadoras',
        imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
        stock: 5,
        marca: 'HP',
        rating: 4.3,
        descuento: 0
      },
      {
        id: 7,
        nombre: 'Smartphone iPhone 14',
        descripcion: 'iPhone 14 128GB con cámara avanzada',
        precio: 999.99,
        categoria: 'Electrónicos',
        subcategoria: 'Móviles',
        imagen: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop',
        stock: 10,
        marca: 'Apple',
        rating: 4.8,
        descuento: 0
      },
      {
        id: 8,
        nombre: 'Audífonos Sony WH-1000XM4',
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        precio: 279.99,
        categoria: 'Electrónicos',
        subcategoria: 'Audio',
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
        stock: 18,
        marca: 'Sony',
        rating: 4.4,
        descuento: 25
      },
      // HOGAR Y DECORACIÓN
      {
        id: 9,
        nombre: 'Sofá Modular 3 Plazas',
        descripcion: 'Sofá cómodo con tapicería de tela gris',
        precio: 899.99,
        categoria: 'Hogar',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
        stock: 4,
        marca: 'HomeStyle',
        rating: 4.1,
        descuento: 0
      },
      {
        id: 10,
        nombre: 'Mesa de Comedor Madera',
        descripcion: 'Mesa para 6 personas en madera maciza',
        precio: 549.99,
        categoria: 'Hogar',
        subcategoria: 'Muebles',
        imagen: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=500&h=400&fit=crop',
        stock: 7,
        marca: 'WoodCraft',
        rating: 4.5,
        descuento: 10
      },
      {
        id: 11,
        nombre: 'Lámpara de Piso LED',
        descripcion: 'Lámpara moderna con luz LED regulable',
        precio: 129.99,
        categoria: 'Hogar',
        subcategoria: 'Iluminación',
        imagen: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=400&fit=crop',
        stock: 14,
        marca: 'LightUp',
        rating: 4.0,
        descuento: 0
      },
      {
        id: 12,
        nombre: 'Aspiradora Robótica',
        descripcion: 'Robot aspiradora con mapeo inteligente',
        precio: 399.99,
        categoria: 'Hogar',
        subcategoria: 'Limpieza',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
        stock: 9,
        marca: 'RoboClean',
        rating: 4.3,
        descuento: 15
      }
    ];

    setProductos(productosCompletos);
    setFilteredProducts(productosCompletos);
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = productos;

    if (selectedCategory) {
      filtered = filtered.filter(producto => 
        producto.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, productos]);

  const categories = [...new Set(productos.map(p => p.categoria))];

  const handleAddToCart = (producto) => {
    addToCart(producto);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (precio, descuento = 0) => {
    if (descuento > 0) {
      const precioFinal = precio * (1 - descuento / 100);
      return {
        original: `$${precio.toFixed(2)}`,
        final: `$${precioFinal.toFixed(2)}`,
        hasDiscount: true
      };
    }
    return {
      final: `$${precio.toFixed(2)}`,
      hasDiscount: false
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nuestros Productos</h1>
              <p className="text-gray-600 mt-2">Descubre la mejor selección de electrodomésticos y electrónicos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cart')}
                className="relative bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos, marcas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(producto => {
            const priceInfo = formatPrice(producto.precio, producto.descuento);
            return (
              <div key={producto.id} className="card group cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Discount Badge */}
                  {producto.descuento > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      -{producto.descuento}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => toggleFavorite(producto.id)}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      {favorites.has(producto.id) ? (
                        <HeartSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Stock indicator */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      producto.stock > 10 ? 'bg-green-100 text-green-800' :
                      producto.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock} disponibles
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      {producto.marca}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {producto.descripcion}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {renderStars(producto.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({producto.rating})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {priceInfo.hasDiscount ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-600">
                          {priceInfo.final}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {priceInfo.original}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {priceInfo.final}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      producto.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>
                      {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-64 mx-auto mb-6 opacity-50">
              <img src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300" alt="No products" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No se encontraron productos</h3>
            <p className="text-gray-600 mb-6">
              Intenta cambiar los filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn-primary"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="font-medium">¡Producto añadido al carrito!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProducts;