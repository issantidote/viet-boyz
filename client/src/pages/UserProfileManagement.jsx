import { useEffect, useMemo, useState } from 'react';
import {
  listProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile
} from '../services/profilesApi';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const emptyForm = {
  name: '',
  email: '',
  location: { city: '', state: '', country: '' },
  skillsCsv: '',       // UI-only, mapped to skills[]
  rolesCsv: '',        // UI-only, mapped to preferences.roles[]
  preferences: { remoteOk: true, notes: '' },
  availability: { timezone: 'America/Chicago', days: [], windows: [{ start: '09:00', end: '17:00' }] }
};

export default function UserProfileManagement() {
  // data
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form/edit state
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // filters
  const [filters, setFilters] = useState({ city: '', skill: '', availableOn: '' });

  // load list
  async function refresh() {
    try {
      setLoading(true);
      setError('');
      const { items, total } = await listProfiles({
        city: filters.city || undefined,
        skill: filters.skill || undefined,
        availableOn: filters.availableOn || undefined,
        limit: 200
      });
      setItems(items);
      setTotal(total);
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { refresh(); /* re-query when filters change */ }, [filters.availableOn]);

  const filteredByClient = useMemo(() => {
    // Client-side filter for city/skill when you don't want to refetch each keystroke
    const skill = filters.skill.trim().toLowerCase();
    const city = filters.city.trim().toLowerCase();
    return items.filter(p => {
      const okCity = city ? p.location.city.toLowerCase().includes(city) : true;
      const okSkill = skill ? p.skills.some(s => s.toLowerCase().includes(skill)) : true;
      return okCity && okSkill;
    });
  }, [items, filters.city, filters.skill]);

  // helpers
  function msg(e) {
    try {
      const s = typeof e === 'string' ? e : e.message || 'Error';
      return s.length > 400 ? s.slice(0, 400) + '…' : s;
    } catch { return 'Error'; }
  }
  const csvToArray = (csv) => csv.split(',').map(s => s.trim()).filter(Boolean);
  const dedupe = (arr) => Array.from(new Set(arr));

  function onChange(e) {
    const { name, value, type, checked } = e.target;

    // top-level switches
    if (name === 'name' || name === 'email') return setForm(f => ({ ...f, [name]: value }));
    if (name === 'skillsCsv') return setForm(f => ({ ...f, skillsCsv: value }));
    if (name === 'rolesCsv') return setForm(f => ({ ...f, rolesCsv: value }));
    if (name === 'notes') return setForm(f => ({ ...f, preferences: { ...f.preferences, notes: value }}));
    if (name === 'remoteOk') return setForm(f => ({ ...f, preferences: { ...f.preferences, remoteOk: checked }}));
    if (name === 'timezone') return setForm(f => ({ ...f, availability: { ...f.availability, timezone: value }}));

    // nested location
    if (name === 'city' || name === 'state' || name === 'country') {
      return setForm(f => ({ ...f, location: { ...f.location, [name]: value }}));
    }
  }

  function toggleDay(day) {
    setForm(f => {
      const has = f.availability.days.includes(day);
      const days = has ? f.availability.days.filter(d => d !== day) : [...f.availability.days, day];
      return { ...f, availability: { ...f.availability, days } };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      location: {
        city: form.location.city.trim(),
        state: form.location.state.trim() || undefined,
        country: form.location.country.trim()
      },
      skills: dedupe(csvToArray(form.skillsCsv)),
      preferences: {
        roles: dedupe(csvToArray(form.rolesCsv)),
        remoteOk: !!form.preferences.remoteOk,
        notes: form.preferences.notes?.trim() || undefined
      },
      availability: {
        timezone: form.availability.timezone || 'America/Chicago',
        days: dedupe(form.availability.days),
        windows: form.availability.windows.map(w => ({ start: w.start, end: w.end }))
      }
    };

    try {
      if (!editingId) {
        const created = await createProfile(payload);
        setItems(prev => [created, ...prev]);
      } else {
        const updated = await updateProfile(editingId, payload);
        setItems(prev => prev.map(p => (p.id === editingId ? updated : p)));
      }
      resetForm();
    } catch (e2) {
      setError(msg(e2));
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onEdit(id) {
    try {
      setError('');
      const p = await getProfile(id);
      setEditingId(id);
      setForm({
        name: p.name || '',
        email: p.email || '',
        location: {
          city: p.location?.city || '',
          state: p.location?.state || '',
          country: p.location?.country || ''
        },
        skillsCsv: (p.skills || []).join(', '),
        rolesCsv: (p.preferences?.roles || []).join(', '),
        preferences: { remoteOk: !!p.preferences?.remoteOk, notes: p.preferences?.notes || '' },
        availability: {
          timezone: p.availability?.timezone || 'America/Chicago',
          days: p.availability?.days || [],
          windows: (p.availability?.windows && p.availability.windows.length > 0)
            ? p.availability.windows
            : [{ start: '09:00', end: '17:00' }]
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(msg(e));
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this profile?')) return;
    try {
      await deleteProfile(id);
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h2>User Profile Management</h2>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Filter by city (client-side)"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
        />
        <input
          placeholder="Filter by skill (client-side)"
          value={filters.skill}
          onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
        />
        <select value={filters.availableOn} onChange={e => setFilters(f => ({ ...f, availableOn: e.target.value }))}>
          <option value="">Available day (server-side)</option>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={refresh}>Refresh</button>
      </div>

      {error && <div style={{ background: '#fee', border: '1px solid #f99', padding: 8, marginBottom: 12 }}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        <h3>{editingId ? 'Edit Profile' : 'Create Profile'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>
            <div>Name</div>
            <input name="name" value={form.name} onChange={onChange} required />
          </label>

          <label>
            <div>Email</div>
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>

          <label>
            <div>City</div>
            <input name="city" value={form.location.city} onChange={onChange} required />
          </label>

          <label>
            <div>State</div>
            <input name="state" value={form.location.state} onChange={onChange} />
          </label>

          <label>
            <div>Country</div>
            <input name="country" value={form.location.country} onChange={onChange} required />
          </label>

          <label>
            <div>Skills (comma-separated)</div>
            <input name="skillsCsv" value={form.skillsCsv} onChange={onChange} placeholder="React, Node.js, SQL" />
          </label>

          <label>
            <div>Preferred Roles (comma-separated)</div>
            <input name="rolesCsv" value={form.rolesCsv} onChange={onChange} placeholder="Coordinator, Organizer" />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" name="remoteOk" checked={form.preferences.remoteOk} onChange={onChange} />
            Remote OK
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            <div>Notes</div>
            <textarea name="notes" value={form.preferences.notes} onChange={onChange} rows={3} />
          </label>

          <label>
            <div>Timezone</div>
            <input name="timezone" value={form.availability.timezone} onChange={onChange} />
          </label>

          <div>
            <div>Available Days</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {DAYS.map(d => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={form.availability.days.includes(d)}
                    onChange={() => toggleDay(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div>Working Window</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input
                type="time"
                value={form.availability.windows[0].start}
                onChange={e =>
                  setForm(f => ({ ...f, availability: { ...f.availability, windows: [{ ...f.availability.windows[0], start: e.target.value }] } }))
                }
              />
              <span>to</span>
              <input
                type="time"
                value={form.availability.windows[0].end}
                onChange={e =>
                  setForm(f => ({ ...f, availability: { ...f.availability, windows: [{ ...f.availability.windows[0], end: e.target.value }] } }))
                }
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="submit">{editingId ? 'Save Changes' : 'Create Profile'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {/* List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>{loading ? 'Loading…' : `${filteredByClient.length} of ${total} profiles`}</strong>
        <button onClick={refresh}>Reload</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Days</th>
              <th>Remote</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredByClient.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.location.city}{p.location.state ? `, ${p.location.state}` : ''}, {p.location.country}</td>
                <td>{p.skills.join(', ')}</td>
                <td>{(p.availability?.days || []).join(' ')}</td>
                <td>{p.preferences?.remoteOk ? 'Yes' : 'No'}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => onEdit(p.id)}>Edit</button>
                  <button onClick={() => onDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && filteredByClient.length === 0 && (
              <tr><td colSpan="7" style={{ padding: 12, color: '#888' }}>No profiles match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

