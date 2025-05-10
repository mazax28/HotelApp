import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-700 text-white mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-lg">Sistema de Hotel</span>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'bg-blue-900' : 'hover:bg-blue-800'
              }`}
            >
              Reservar Habitación
            </Link>
            <Link
              to="/reservations"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/reservations'
                  ? 'bg-blue-900'
                  : 'hover:bg-blue-800'
              }`}
            >
              Ver Reservaciones
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
