import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Requests from './pages/Requests.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './state/AuthContext.jsx';

export default function App() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return (
    <div className="min-h-screen">
      <header className="header-gradient sticky top-0 z-40 shadow-md">
        <div className="container-page flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white mr-auto">SlotSwapper</h1>
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/30 text-white px-3 py-2"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          {user ? (
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold underline decoration-white/70 underline-offset-4' : 'text-white/90 hover:text-white'}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/market"
                className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold underline decoration-white/70 underline-offset-4' : 'text-white/90 hover:text-white'}`}
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold underline decoration-white/70 underline-offset-4' : 'text-white/90 hover:text-white'}`}
              >
                Requests
              </NavLink>
              <button className="btn btn-outline-light" onClick={logout}>Logout</button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4">
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold underline decoration-white/70 underline-offset-4' : 'text-white/90 hover:text-white'}`}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold underline decoration-white/70 underline-offset-4' : 'text-white/90 hover:text-white'}`}>Signup</NavLink>
            </nav>
          )}
        </div>
        {open && (
          <div className="md:hidden border-t border-white/20 transition-all duration-200">
            <div className="container-page flex flex-col gap-3 pb-4">
              {user ? (
                <>
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold' : 'text-white'}`} to="/">Dashboard</NavLink>
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold' : 'text-white'}`} to="/market">Marketplace</NavLink>
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold' : 'text-white'}`} to="/requests">Requests</NavLink>
                  <button className="btn btn-outline-light w-full" onClick={() => { setOpen(false); logout(); }}>Logout</button>
                </>
              ) : (
                <>
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold' : 'text-white'}`} to="/login">Login</NavLink>
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'text-white font-semibold' : 'text-white'}`} to="/signup">Signup</NavLink>
                </>
              )}
            </div>
          </div>
        )}
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
