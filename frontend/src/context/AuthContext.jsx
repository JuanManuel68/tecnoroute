import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email y contraseña son requeridos' };
      }

      // Autenticación con la API de Django
      try {
        // Convertir email a username si es necesario
        let username = email;
        
        const response = await fetch('http://localhost:8000/api/auth/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password })
        });

        if (response.ok) {
          const data = await response.json();
          
          const userData = {
            id: data.user.id,
            name: (data.user.first_name + ' ' + data.user.last_name).trim(),
            email: data.user.email,
            role: data.user.role,
            // Incluir información del conductor si existe
            ...(data.user.role === 'conductor' && data.conductor_info && {
              conductor_info: data.conductor_info
            })
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('authToken', data.token);
          
          return { success: true };
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error || 'Credenciales inválidas' };
        }
      } catch (apiError) {
        console.error('Error conectando con el servidor:', apiError);
        return { success: false, error: 'Error de conexión con el servidor. Verifique su conexión a internet.' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (...args) => {
    try {
      let userData = args[0];
      
      // Si recibe los datos antiguos (compatibilidad)
      if (typeof userData === 'string') {
        const [name, email, password] = args;
        userData = { name, email, password };
      }
      
      console.log('Datos recibidos para registro:', userData);
      
      if (userData.name && userData.email && userData.password) {
        // Intentar registro con la API de Django
        try {
          const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: userData.email, // Usar email como username
              email: userData.email,
              first_name: userData.name.split(' ')[0] || userData.name,
              last_name: userData.name.split(' ').slice(1).join(' ') || '',
              password: userData.password,
              password_confirm: userData.confirmPassword,
              telefono: userData.phone || '',
              direccion: userData.address || '',
              city: userData.city || '',
              role: userData.role || 'customer',
              cedula: userData.cedula || '',
              licencia: userData.licencia || ''
            })
          });

          const responseData = await response.json();
          console.log('Respuesta del backend:', responseData);

          if (response.ok && responseData.success) {
            // Registro exitoso en backend
            const newUser = {
              id: responseData.user.id,
              name: (responseData.user.first_name + ' ' + responseData.user.last_name).trim(),
              email: responseData.user.email,
              role: responseData.user.role,
              // Incluir información del conductor si existe
              ...(responseData.user.role === 'conductor' && responseData.conductor_info && {
                conductor_info: responseData.conductor_info
              })
            };
            
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('authToken', responseData.token);
            
            return { success: true, message: responseData.message };
          } else {
            // Error en el backend
            return { success: false, error: responseData.error || 'Error en el registro' };
          }
        } catch (apiError) {
          console.error('Error conectando con el servidor:', apiError);
          return { success: false, error: 'Error de conexión con el servidor. Verifique su conexión a internet.' };
        }
      } else {
        return { success: false, error: 'Nombre, email y contraseña son requeridos' };
      }
    } catch (error) {
      console.error('Error en función de registro:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user' || user?.role === 'customer';
  };

  const isConductor = () => {
    return user?.role === 'conductor';
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'conductor':
        return '/conductor/dashboard';
      case 'customer':
      default:
        return '/productos';
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isUser,
    isConductor,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
