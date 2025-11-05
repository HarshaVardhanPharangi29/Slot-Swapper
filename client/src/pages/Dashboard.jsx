import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../lib/api.js';
import { useAuth } from '../state/AuthContext.jsx';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function Dashboard() {
  const api = useApi();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [calHeight, setCalHeight] = useState(600);

  const reload = async () => {
    try {
      const data = await api.getMyEvents();
      setEvents(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { reload(); }, []);

  useEffect(() => {
    const onResize = () => setCalHeight(window.innerWidth < 640 ? 400 : 600);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createEvent({ title, startTime: start, endTime: end });
      setTitle(''); setStart(''); setEnd('');
      reload();
    } catch (e) { setError(e.message); }
  };

  const setStatus = async (id, status) => {
    try { await api.updateEvent(id, { status }); reload(); } catch (e) { setError(e.message); }
  };
  const remove = async (id) => {
    try { await api.deleteEvent(id); reload(); } catch (e) { setError(e.message); }
  };

  const locales = { 'en-US': enUS };
  const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });
  const calendarEvents = useMemo(() =>
    events.map(ev => ({
      id: ev._id,
      title: `${ev.title}${ev.status === 'SWAPPABLE' ? ' (Swappable)' : ''}`,
      start: new Date(ev.startTime),
      end: new Date(ev.endTime),
      resource: ev,
    })), [events]
  );

  return (
    <div className="space-y-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h3 className="heading">My Events</h3>
          <div className="text-sm text-gray-600">Hello, {user?.name}</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'} w-full sm:w-auto`} onClick={() => setViewMode('list')}>List</button>
          <button className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'} w-full sm:w-auto`} onClick={() => setViewMode('calendar')}>Calendar</button>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="subheading mb-3">Add new event</h4>
  <form onSubmit={onCreate} className="grid sm:grid-cols-2 gap-3 max-w-2xl">
          <div className="sm:col-span-2">
            <label className="label">Title</label>
            <input className="input mt-1" placeholder="Team Meeting" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Start</label>
            <input className="input mt-1" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="label">End</label>
            <input className="input mt-1" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600 sm:col-span-2">{error}</div>}
          <div className="sm:col-span-2"><button type="submit" className="btn btn-primary">Add Event</button></div>
        </form>
      </div>

      {viewMode === 'list' ? (
        <ul className="grid gap-3">
          {events.map(ev => (
            <li key={ev._id} className="card p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{ev.title}</div>
                  <div className="text-sm text-gray-600">{new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}</div>
                  <div className="text-xs mt-1"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{ev.status}</span></div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                  <button className="btn btn-secondary w-full sm:w-auto" onClick={() => setStatus(ev._id, 'BUSY')}>Set Busy</button>
                  <button className="btn btn-primary w-full sm:w-auto" onClick={() => setStatus(ev._id, 'SWAPPABLE')}>Make Swappable</button>
                  <button className="btn btn-danger w-full sm:w-auto" onClick={() => remove(ev._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-4 overflow-hidden">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ minHeight: calHeight }}
            popup
          />
        </div>
      )}
    </div>
  );
}
