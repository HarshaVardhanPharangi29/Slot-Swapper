import React, { useEffect, useState } from 'react';
import { useApi } from '../lib/api.js';

export default function Marketplace() {
  const api = useApi();
  const [theirSlots, setTheirSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [offerId, setOfferId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reload = async () => {
    try {
      setSuccess('');
      const [ts, my] = await Promise.all([
        api.getSwappableSlots(),
        api.getMyEvents(),
      ]);
      setTheirSlots(ts);
      setMySlots(my.filter(e => e.status === 'SWAPPABLE'));
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { reload(); }, []);

  const requestSwap = async () => {
    if (!chosen || !offerId) return;
    try {
      await api.createSwapRequest({ mySlotId: offerId, theirSlotId: chosen._id });
      setChosen(null); setOfferId('');
      setSuccess('Swap request sent');
      reload();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h3 className="heading">Marketplace</h3>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-700">{success}</div>}
      <ul className="grid gap-3">
        {theirSlots.map(slot => (
          <li key={slot._id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">{slot.title}</div>
                <div className="text-sm text-gray-600">{new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}</div>
              </div>
              <button className="btn btn-primary" onClick={() => setChosen(slot)}>Request Swap</button>
            </div>
          </li>
        ))}
      </ul>

      {chosen && (
        <div className="card p-4">
          <h4 className="subheading">Offer one of your swappable slots for "{chosen.title}"</h4>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 items-end max-w-xl">
            <div className="sm:col-span-2">
              <label className="label">Your swappable slot</label>
              <select className="input mt-1" value={offerId} onChange={(e) => setOfferId(e.target.value)}>
                <option value="">Select slot</option>
                {mySlots.map(ms => (
                  <option key={ms._id} value={ms._id}>
                    {ms.title} ({new Date(ms.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button className="btn btn-primary" onClick={requestSwap} disabled={!offerId}>Send Request</button>
              <button className="btn btn-secondary" onClick={() => { setChosen(null); setOfferId(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
