import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TicketListPage from './TicketListPage';
import CreateTicketPage from './CreateTicketPage';
import TicketDetailPage from './TicketDetailPage';

const ClientDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<TicketListPage />} />
      <Route path="/crear-ticket" element={<CreateTicketPage />} />
      <Route path="/tickets/:id" element={<TicketDetailPage />} />
    </Routes>
  );
};

export default ClientDashboard;