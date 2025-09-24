import React from 'react';
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowLeftIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ModernCart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8 text-lg">
              ¡Explora nuestros productos y añade algunos artículos!
            </p>
            <button
              onClick={() => navigate('/productos')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Carrito</h1>
          <p className="text-gray-600">Revisa y modifica tu selección de productos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.marca}</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(item.precio)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de compra */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Compra</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-semibold">{formatPrice(getCartTotal() * 0.1)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(getCartTotal() * 1.1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <CreditCardIcon className="w-5 h-5" />
                  <span>Proceder al Pago</span>
                </button>
                
                <button
                  onClick={() => navigate('/productos')}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Seguir Comprando</span>
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Información de Envío</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🚚 <strong>Envío gratis</strong> en pedidos superiores a $50</p>
                <p>📦 <strong>Entrega:</strong> 2-3 días hábiles</p>
                <p>🔒 <strong>Pago seguro</strong> con encriptación SSL</p>
                <p>↩️ <strong>Devoluciones:</strong> 30 días sin preguntas</p>
              </div>
            </div>

            {cartItems.length > 1 && (
              <div className="card p-6">
                <button
                  onClick={clearCart}
                  className="w-full py-2 px-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCart;