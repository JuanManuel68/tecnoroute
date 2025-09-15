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

      // Intentar autenticación con la API de Django
      try {
        // Convertir email a username para los usuarios conocidos
        let username = email;
        if (email === 'admin@tecnoroute.com') username = 'admin';
        if (email === 'usuario1@gmail.com') username = 'usuario1';
        if (email === 'usuario2@gmail.com') username = 'usuario2';
        if (email === 'cliente@hotmail.com') username = 'cliente1';
        
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
            name: data.user.first_name + ' ' + data.user.last_name,
            email: data.user.email,
            role: data.user.role
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
        console.warn('API not available, using mock authentication:', apiError);
        
        // Fallback a mock users si la API no está disponible
        const mockUsers = {
          'admin@tecnoroute.com': {
            id: 1,
            name: 'Administrador',
            email: 'admin@tecnoroute.com',
            role: 'admin',
            password: 'admin123'
          },
          'usuario@tecnoroute.com': {
            id: 2,
            name: 'Usuario Cliente',
            email: 'usuario@tecnoroute.com',
            role: 'user',
            password: 'user123'
          }
        };
        
        const mockUser = mockUsers[email];
        if (mockUser && mockUser.password === password) {
          const { password: _, ...userWithoutPassword } = mockUser;
          
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          localStorage.setItem('authToken', 'mock-jwt-token');
          
          return { success: true };
        } else {
          return { success: false, error: 'Credenciales inválidas' };
        }
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
      
      if (userData.name && userData.email && userData.password) {
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          paymentMethod: userData.paymentMethod,
          role: 'user' // Los nuevos usuarios siempre son 'user'
        };
        
        // Aquí normalmente enviarías los datos al backend
        // const response = await apiService.post('/api/users/', newUser);
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('authToken', 'mock-jwt-token');
        
        return { success: true };
      } else {
        return { success: false, error: 'Todos los campos son requeridos' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
