import React, { useState } from 'react';
import {
  TruckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  UserIcon as UserSolid,
  CogIcon as CogSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ModernLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type'); // 'admin' o 'user'

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el rol del usuario
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/productos');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    // Auto login después de un pequeño delay para mostrar los datos
    setTimeout(() => {
      handleLogin({ preventDefault: () => {} });
    }, 500);
  };

  const demoCredentials = [
    { 
      email: 'admin@tecnoroute.com', 
      password: 'admin123', 
      role: 'Administrador', 
      description: 'Panel administrativo completo',
      icon: CogSolid,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      email: 'usuario@tecnoroute.com', 
      password: 'user123', 
      role: 'Usuario Cliente', 
      description: 'Tienda de electrodomésticos',
      icon: UserSolid,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
              <TruckIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {loginType === 'user' ? '🛒 Tienda TecnoRoute' : 'Bienvenido a TecnoRoute'}
          </h1>
          <p className="text-xl text-gray-600">
            {loginType === 'user' 
              ? 'Accede para ver nuestros electrodomésticos'
              : 'Accede a tu cuenta para continuar'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Formulario de Login */}
          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pl-11"
                    placeholder="correo@ejemplo.com"
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-2">¿No tienes cuenta?</p>
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          </div>

          {/* Cuentas de Demo */}
          <div className="card p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                🧪 Cuentas de Prueba
              </h3>
              <p className="text-gray-600">Usa estas credenciales para probar el sistema</p>
            </div>

            <div className="space-y-4">
              {demoCredentials.map((cred, index) => {
                const IconComponent = cred.icon;
                return (
                  <div key={index} className={`${cred.bgColor} border-2 border-transparent hover:border-primary-300 rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`${cred.color} p-3 rounded-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-3">
                          <h4 className={`font-semibold text-lg ${cred.textColor}`}>
                            {cred.role}
                          </h4>
                          <p className="text-gray-600 text-sm">{cred.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>
                        </p>
                        <p className="font-mono text-sm text-gray-800">{cred.email}</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Contraseña:</span>
                        </p>
                        <p className="font-mono text-sm text-gray-800">{cred.password}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickLogin(cred.email, cred.password)}
                      disabled={loading}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        loading 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : `${cred.color} hover:opacity-90 text-white transform hover:scale-105 shadow-md hover:shadow-lg`
                      }`}
                    >
                      {loading ? 'Cargando...' : `Probar como ${cred.role}`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Información</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Administrador:</strong> Gestión completa del sistema</li>
                  <li>• <strong>Usuario:</strong> Comprar productos en la tienda</li>
                  <li>• Las credenciales se rellenan automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
            <TruckIcon className="w-5 h-5" />
            <span className="font-medium">TecnoRoute</span>
          </div>
          <p className="text-sm text-gray-400">
            Sistema de Gestión Logística y Tienda de Electrodomésticos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;