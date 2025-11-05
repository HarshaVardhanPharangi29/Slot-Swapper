import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { useApi } from '../lib/api.js';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const api = useApi();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.signup({ name, email, password });
      login(data);
      nav('/', { replace: true });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-6">
        <h3 className="heading mb-4">Create account</h3>
        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input mt-1" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="btn btn-primary w-full">Create account</button>
        </form>
        <div className="text-sm text-gray-600 mt-3 text-center">Already have an account? <Link className="text-brand-700 hover:underline" to="/login">Login</Link></div>
      </div>
    </div>
  </div>
  );
}
