import React, { useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-screen">
      <header className="header-gradient">
        <div className="container-page flex items-center gap-4 relative">
          <h1 className="text-xl font-semibold text-white mr-auto">SlotSwapper</h1>

          {/* Desktop nav */}
          {user ? (
            <nav className="hidden sm:flex items-center gap-4">
              <Link className="nav-link text-white/90 hover:text-white" to="/">Dashboard</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/market">Marketplace</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/requests">Requests</Link>
              <button className="btn btn-outline-light" onClick={logout}>Logout</button>
            </nav>
          ) : (
            <nav className="hidden sm:flex items-center gap-4">
              <Link className="nav-link text-white/90 hover:text-white" to="/login">Login</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/signup">Signup</Link>
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(v => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>

          {/* Mobile nav panel */}
          {mobileOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg rounded-b-lg p-4 sm:hidden">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="nav-link text-white">Dashboard</Link>
                    <Link to="/market" onClick={() => setMobileOpen(false)} className="nav-link text-white">Marketplace</Link>
                    <Link to="/requests" onClick={() => setMobileOpen(false)} className="nav-link text-white">Requests</Link>
                    <button className="btn btn-outline-light w-full" onClick={() => { setMobileOpen(false); logout(); }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-link text-white">Login</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="nav-link text-white">Signup</Link>
                  </>
                )}
              </div>
            </div>
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
