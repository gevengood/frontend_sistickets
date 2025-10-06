// AdminDashboard.js - Este archivo ya no es necesario si sigues el approach anterior
// Pero si prefieres mantenerlo, déjalo así:
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AgentDashboard from './AgentDashboard';
import CreateUserPage from './CreateUserPage';
import UserListPage from './UserListPage';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/admin/crear-usuario" element={<CreateUserPage />} />
      <Route path="/admin/usuarios" element={<UserListPage />} />
      <Route path="/*" element={<AgentDashboard />} />
    </Routes>
  );
};

export default AdminDashboard;