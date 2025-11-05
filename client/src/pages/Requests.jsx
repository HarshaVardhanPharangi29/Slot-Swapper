import React, { useEffect, useState } from 'react';
import { useApi } from '../lib/api.js';

export default function Requests() {
  const api = useApi();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [error, setError] = useState('');

  const reload = async () => {
    try {
      const data = await api.getSwapRequests();
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { reload(); }, []);

  const respond = async (id, accept) => {
    try { await api.respondSwap(id, accept); reload(); } catch (e) { setError(e.message); }
  };

  const fmt = (ev) => `${ev.title} (${new Date(ev.startTime).toLocaleString()})`;

  return (
    <div className="space-y-4">
      <h3 className="heading">Swap Requests</h3>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h4 className="subheading mb-2">Incoming</h4>
          <ul className="grid gap-3">
            {incoming.map(r => (
              <li key={r._id} className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm">They offer: <span className="font-medium">{r.mySlot ? fmt(r.mySlot) : '...'}</span></div>
                <div className="text-sm">For your: <span className="font-medium">{r.theirSlot ? fmt(r.theirSlot) : '...'}</span></div>
                <div className="text-xs mt-1"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{r.status}</span></div>
                {r.status === 'PENDING' && (
                  <div className="flex gap-2 mt-3">
                    <button className="btn btn-primary" onClick={() => respond(r._id, true)}>Accept</button>
                    <button className="btn btn-secondary" onClick={() => respond(r._id, false)}>Reject</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h4 className="subheading mb-2">Outgoing</h4>
          <ul className="grid gap-3">
            {outgoing.map(r => (
              <li key={r._id} className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm">You offered: <span className="font-medium">{r.mySlot ? fmt(r.mySlot) : '...'}</span></div>
                <div className="text-sm">For: <span className="font-medium">{r.theirSlot ? fmt(r.theirSlot) : '...'}</span></div>
                <div className="text-xs mt-1"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{r.status}</span></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
