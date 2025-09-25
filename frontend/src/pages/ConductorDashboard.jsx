import React, { useState, useEffect, useCallback } from 'react';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HandRaisedIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  TruckIcon as TruckIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/apiService';

const ConductorDashboard = () => {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(null);

  // Cargar pedidos pendientes
  const loadPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pedidosAPI.getAll();
      // Filtrar solo pedidos pendientes
      const pending = response.data.filter(order => order.estado === 'pendiente');
      setPendingOrders(pending);
      
      // Verificar si hay pedido activo para este conductor
      const confirmed = response.data.find(order => {
        if (order.estado === 'confirmado') {
          // Si no hay información del conductor, verificar por usuario
          if (user?.conductor_info?.id) {
            return order.conductor_info && 
                   order.conductor_info.id === user.conductor_info.id;
          } else {
            // Fallback: verificar por ID de usuario
            return order.conductor_info && 
                   order.conductor_info.user_id === user?.id;
          }
        }
        return false;
      });
      if (confirmed) {
        setActiveOrder(confirmed);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [user?.conductor_info?.id, user?.id]);

  useEffect(() => {
    console.log('Usuario conductor:', user);
    console.log('Conductor info:', user?.conductor_info);
    console.log('User role:', user?.role);
    loadPendingOrders();
    // Recargar cada 30 segundos
    const interval = setInterval(loadPendingOrders, 30000);
    return () => clearInterval(interval);
  }, [loadPendingOrders, user]);

  // Asignar pedido al conductor
  const handleTakeOrder = async (order) => {
    try {
      setAssigningOrder(order.id);
      
      // Cambiar estado del pedido a confirmado y asignar conductor
      await pedidosAPI.cambiarEstado(order.id, 'confirmado');
      
      // Actualizar estado local
      setActiveOrder({
        ...order,
        estado: 'confirmado',
        conductor_info: user?.conductor_info || {
          id: user?.id,
          user_id: user?.id,
          name: user?.name
        }
      });
      
      // Remover de pedidos pendientes
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));
      
    } catch (error) {
      console.error('Error taking order:', error);
      alert('Error al tomar el pedido. Intente de nuevo.');
    } finally {
      setAssigningOrder(null);
    }
  };

  // Completar pedido
  const handleCompleteOrder = async () => {
    if (!activeOrder) return;
    
    try {
      await pedidosAPI.cambiarEstado(activeOrder.id, 'entregado');
      setActiveOrder(null);
      loadPendingOrders(); // Recargar lista
      alert('¡Pedido completado exitosamente!');
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Error al completar el pedido. Intente de nuevo.');
    }
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para abrir Google Maps con la dirección
  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/${encodedAddress}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <TruckIconSolid className="w-10 h-10 text-primary-600 mr-3" />
                Dashboard del Conductor
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {user?.name || 'Conductor'}. Gestiona tus entregas aquí.
              </p>
            </div>
            <button
              onClick={loadPendingOrders}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Actualizar</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pedido Activo */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CheckCircleIconSolid className="w-6 h-6 text-green-600 mr-2" />
              Pedido Activo
            </h2>

            {activeOrder ? (
              <div className="bg-white rounded-2xl shadow-xl border-l-4 border-green-500 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pedido #{activeOrder.numero_pedido}
                      </h3>
                      <p className="text-green-600 font-medium">En progreso</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(activeOrder.total)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Dirección de entrega:</p>
                        <p className="text-gray-600">{activeOrder.direccion_envio}</p>
                      </div>
                      <button
                        onClick={() => openGoogleMaps(activeOrder.direccion_envio)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        <span>Ruta</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Teléfono de contacto:</p>
                        <p className="text-gray-600">{activeOrder.telefono_contacto}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Fecha del pedido:</p>
                        <p className="text-gray-600">{formatDate(activeOrder.fecha_creacion)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Productos del pedido */}
                  <div className="border-t pt-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Productos a entregar:</h4>
                    <div className="space-y-2">
                      {(activeOrder.items || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{item.producto?.nombre || 'Producto'}</span>
                          <span className="text-gray-600">Cant: {item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    ✅ Marcar como Entregado
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes pedidos activos
                </h3>
                <p className="text-gray-600">
                  Selecciona un pedido de la lista de pedidos pendientes para comenzar.
                </p>
              </div>
            )}
          </div>

          {/* Pedidos Pendientes */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <ClockIcon className="w-6 h-6 text-yellow-600 mr-2" />
              Pedidos Pendientes ({pendingOrders.length})
            </h2>

            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <CheckCircleIconSolid className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Excelente trabajo!
                </h3>
                <p className="text-gray-600">
                  No hay pedidos pendientes en este momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Pedido #{order.numero_pedido}
                        </h4>
                        <p className="text-yellow-600 font-medium flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          Pendiente
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.fecha_creacion)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{order.direccion_envio}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{order.telefono_contacto}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-600">
                        {(order.items || []).length} producto(s)
                      </span>
                      <button
                        onClick={() => handleTakeOrder(order)}
                        disabled={!!activeOrder || assigningOrder === order.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          activeOrder
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : assigningOrder === order.id
                            ? 'bg-primary-400 text-white cursor-wait'
                            : 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105'
                        }`}
                      >
                        {assigningOrder === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Asignando...</span>
                          </>
                        ) : activeOrder ? (
                          <>
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <span>Completa pedido activo</span>
                          </>
                        ) : (
                          <>
                            <HandRaisedIcon className="w-4 h-4" />
                            <span>Tomar Pedido</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductorDashboard;