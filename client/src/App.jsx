import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Requests from './pages/Requests.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './state/AuthContext.jsx';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="header-gradient">
        <div className="container-page flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white mr-auto">SlotSwapper</h1>
          {user ? (
            <nav className="flex items-center gap-4">
              <Link className="nav-link text-white/90 hover:text-white" to="/">Dashboard</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/market">Marketplace</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/requests">Requests</Link>
              <button className="btn btn-outline-light" onClick={logout}>Logout</button>
            </nav>
          ) : (
            <nav className="flex items-center gap-4">
              <Link className="nav-link text-white/90 hover:text-white" to="/login">Login</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/signup">Signup</Link>
            </nav>
          )}
        </div>
      </header>
      <main className="container-page space-y-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}
