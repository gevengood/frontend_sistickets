// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // NUEVA FUNCIÓN: Actualizar datos del usuario
  const actualizarUsuario = (nuevosDatos) => {
    setUsuario(prevUsuario => ({
      ...prevUsuario,
      ...nuevosDatos
    }));
    // También guardar en localStorage para persistencia
    if (nuevosDatos.forzar_cambio_password !== undefined) {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
      localStorage.setItem('usuario', JSON.stringify({
        ...usuarioStorage,
        ...nuevosDatos
      }));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          
          // Obtener datos COMPLETOS del usuario desde la API
          try {
            const response = await fetch('http://localhost:5000/api/auth/mi-perfil', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUsuario({
                id: decodedToken.usuarioId,
                rol: decodedToken.rol,
                nombre: decodedToken.nombre,
                forzar_cambio_password: userData.forzar_cambio_password,
                email: userData.email
              });
              // Guardar en localStorage
              localStorage.setItem('usuario', JSON.stringify({
                id: decodedToken.usuarioId,
                rol: decodedToken.rol,
                nombre: decodedToken.nombre,
                forzar_cambio_password: userData.forzar_cambio_password,
                email: userData.email
              }));
            } else {
              throw new Error('Error al obtener datos del usuario');
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Fallback a datos básicos del token
            setUsuario({ 
              id: decodedToken.usuarioId, 
              rol: decodedToken.rol, 
              nombre: decodedToken.nombre,
              forzar_cambio_password: true // Por seguridad, asumir que debe cambiar
            });
          }
        } catch (error) {
          console.error("Token inválido", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('usuario');
          setToken(null);
        }
      }
      setCargandoAuth(false);
    };

    initAuth();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      token, 
      login, 
      logout, 
      cargandoAuth,
      actualizarUsuario // <-- EXPORTAR LA NUEVA FUNCIÓN
    }}>
      {children}
    </AuthContext.Provider>
  );
};