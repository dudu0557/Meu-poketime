import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';

// Componente para proteger rotas privadas
const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Dashboard real */}
        <Route path="/dashboard" element={
          <RotaPrivada>
            <Dashboard />
          </RotaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;