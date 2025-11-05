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
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="header-gradient">
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
              <Link className="nav-link text-white/90 hover:text-white" to="/">Dashboard</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/market">Marketplace</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/requests">Requests</Link>
              <button className="btn btn-outline-light" onClick={logout}>Logout</button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4">
              <Link className="nav-link text-white/90 hover:text-white" to="/login">Login</Link>
              <Link className="nav-link text-white/90 hover:text-white" to="/signup">Signup</Link>
            </nav>
          )}
        </div>
        {open && (
          <div className="md:hidden border-t border-white/20">
            <div className="container-page flex flex-col gap-3 pb-4">
              {user ? (
                <>
                  <Link className="nav-link text-white" to="/" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link className="nav-link text-white" to="/market" onClick={() => setOpen(false)}>Marketplace</Link>
                  <Link className="nav-link text-white" to="/requests" onClick={() => setOpen(false)}>Requests</Link>
                  <button className="btn btn-outline-light w-full" onClick={() => { setOpen(false); logout(); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link className="nav-link text-white" to="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link className="nav-link text-white" to="/signup" onClick={() => setOpen(false)}>Signup</Link>
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
