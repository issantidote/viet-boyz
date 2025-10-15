import { useEffect, useMemo, useState, useRef } from 'react';
import {
  listProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile
} from '../services/profilesApi';

// NOTE: This component keeps your existing data model & API calls
// and only refactors the UI to match your previous assignment styles
// (colors.scss, components.scss) using classes like:
// profile-container, card profile-card, section-header, form-group-custom, etc.

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_LABELS = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const emptyForm = {
  name: '',
  location: { address1: '', address2: '', city: '', state: '' },
  skills: [],
  // rolesCsv removed
  preferences: { notes: '' },
  availability: { days: [] }
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
    const skill = filters.skill.trim().toLowerCase();
    const city = filters.city.trim().toLowerCase();
    return items.filter(p => {
      const okCity = city ? (p.location.city || '').toLowerCase().includes(city) : true;
      const okSkill = skill ? (p.skills || []).some(s => s.toLowerCase().includes(skill)) : true;
      return okCity && okSkill;
    });
  }, [items, filters.city, filters.skill]);

  // curated Computer Science skill list (fixed)
  const availableSkills = useMemo(() => [
    'Algorithms', 'Data Structures', 'Databases', 'SQL', 'NoSQL', 'Operating Systems',
    'Networking', 'Computer Architecture', 'Distributed Systems', 'Security', 'Cryptography',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Web Development',
    'Frontend', 'Backend', 'DevOps', 'Docker', 'Kubernetes', 'Testing', 'CI/CD',
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'GraphQL',
    'React', 'Node.js'
  ], []);

    const [skillsError, setSkillsError] = useState('');
    const [daysError, setDaysError] = useState('');

  // helpers
  function msg(e) {
    try {
      const s = typeof e === 'string' ? e : e.message || 'Error';
      return s.length > 400 ? s.slice(0, 400) + '…' : s;
    } catch { return 'Error'; }
  }
  const dedupe = (arr) => Array.from(new Set(arr));

  const skillsRef = useRef(null);
  const [showSkills, setShowSkills] = useState(false);

  function toggleSkill(skill) {
    setForm(f => {
      const has = (f.skills || []).includes(skill);
      const skills = has ? f.skills.filter(s => s !== skill) : [...(f.skills || []), skill];
      return { ...f, skills };
    });
  }

  useEffect(() => {
    function onDocClick(e) {
      if (showSkills && skillsRef.current && !skillsRef.current.contains(e.target)) {
        setShowSkills(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showSkills]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === 'name') return setForm(f => ({ ...f, [name]: value }));
    // rolesCsv removed
    if (name === 'notes') return setForm(f => ({ ...f, preferences: { ...f.preferences, notes: value }}));
    if (name === 'timezone') return; // timezone removed

    if (name === 'city' || name === 'state' || name === 'address1' || name === 'address2') {
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
    // inline validation for skills
    if (!form.skills || form.skills.length === 0) {
      setSkillsError('Please select at least one skill');
      return;
    }
    setSkillsError('');

    // inline validation for available days (required)
    if (!form.availability || !form.availability.days || form.availability.days.length === 0) {
      setDaysError('Please select at least one available day');
      return;
    }
    setDaysError('');

    const payload = {
      name: form.name.trim(),
      location: {
        address1: form.location.address1?.trim() || undefined,
        address2: form.location.address2?.trim() || undefined,
        city: form.location.city.trim(),
        state: form.location.state.trim() || undefined
      },
  skills: dedupe(form.skills || []),
        preferences: {
        notes: form.preferences.notes?.trim() || undefined
      },
      availability: {
        days: dedupe(form.availability.days)
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
        location: {
          address1: p.location?.address1 || '',
          address2: p.location?.address2 || '',
          city: p.location?.city || '',
          state: p.location?.state || ''
        },
  skills: (p.skills || []),
        preferences: { notes: p.preferences?.notes || '' },
        availability: {
          days: p.availability?.days || []
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
    <div className="profile-container">
      <div className="card profile-card">
        {/* Header */}
        <div className="profile-header">
          <h2>Profile Management</h2>
          <p>Complete your profile to participate in volunteer events</p>
        </div>

        {/* Top-level error */}
        {error && (
          <div className="error-message-custom" style={{ margin: '0 24px 16px' }}>
            <i className="bi bi-exclamation-triangle"/> {error}
          </div>
        )}

        {/* Form Body */}
        <form className="profile-body" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="mb-5">
            <div className="section-header">
              <div className="section-icon">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="section-title">Personal Information</h3>
            </div>
            <div className="form-row-custom">
              <div className="form-group-custom">
                <label className="form-label-custom">Full Name <span style={{color: 'rgb(150, 12, 34)'}}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  maxLength={50}
                  className="form-control-custom"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          </div>
          {/* Address (Address 1/2 + City/State) */}
          <div className="mb-5">
            <div className="section-header">
              <div className="section-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <h3 className="section-title">Address</h3>
            </div>

            <div className="form-row-custom">
              <div className="form-group-custom">
                <label className="form-label-custom">Address 1 <span style={{color: 'rgb(150, 12, 34)'}}>*</span></label>
                <input
                  type="text"
                  name="address1"
                  value={form.location.address1}
                  onChange={onChange}
                  maxLength={100}
                  className="form-control-custom"
                  placeholder="Street address, P.O. box, company name, c/o"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Address 2</label>
                <input
                  type="text"
                  name="address2"
                  value={form.location.address2}
                  onChange={onChange}
                  maxLength={100}
                  className="form-control-custom"
                  placeholder="Apt, suite, unit, building, floor (optional)"
                />
              </div>
            </div>

            <div className="form-row-custom">
              <div className="form-group-custom">
                <label className="form-label-custom">City <span style={{color: 'rgb(150, 12, 34)'}}>*</span></label>
                <input
                  type="text"
                  name="city"
                  value={form.location.city}
                  onChange={onChange}
                  maxLength={100}
                  className="form-control-custom"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">State</label>
                <select name="state" value={form.location.state} onChange={onChange} className="form-control-custom">
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Skills & Preferences Section */}
          <div className="mb-5">
            <div className="section-header">
              <div className="section-icon">
                <i className="bi bi-gear"></i>
              </div>
              <h3 className="section-title">Skills & Preferences</h3>
            </div>

            <div className="form-group-custom" ref={skillsRef} style={{ position: 'relative' }}>
              <label className="form-label-custom">Skills <span style={{color: 'rgb(150, 12, 34)'}}>*</span></label>
              <button type="button" className="form-control-custom" onClick={() => setShowSkills(s => !s)} style={{ textAlign: 'left' }}>
                {form.skills && form.skills.length > 0 ? form.skills.join(', ') : 'Select skills...'}
              </button>
              {showSkills && (
                <div style={{ position: 'absolute', zIndex: 50, background: '#fff', border: '1px solid #ddd', width: '100%', maxHeight: 240, overflow: 'auto', padding: 8 }}>
                  {/* defensive: if availableSkills is empty (unexpected), fall back to a small default list */}
                  {((availableSkills && availableSkills.length) ? availableSkills : [
                    'Algorithms','Data Structures','Databases','Web Development','React','Node.js','Python','JavaScript'
                  ]).map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(form.skills || []).includes(s)}
                        onChange={() => toggleSkill(s)}
                        style={{ width: 16, height: 16 }}
                      />
                      <span style={{ color: '#111' }}>{s}</span>
                    </label>
                  ))}
                  {!availableSkills || availableSkills.length === 0 ? (
                    <div style={{ padding: 8, color: '#666' }}>No skills available.</div>
                  ) : null}
                </div>
              )}
              <small className="helper-text">Choose one or more Computer Science skills. Required.</small>
              {skillsError && <div style={{ color: 'red', marginTop: 6 }}>{skillsError}</div>}
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Preferences (Optional)</label>
              <textarea
                name="notes"
                value={form.preferences.notes}
                onChange={onChange}
                rows={4}
                className="form-control-custom"
                placeholder="Tell us about your preferences, constraints, certifications, languages…"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Availability Section */}
          <div className="mb-5">
            <div className="section-header">
              <div className="section-icon">
                <i className="bi bi-calendar"></i>
              </div>
              <h3 className="section-title">Availability</h3>
            </div>

            <div className="form-row-custom">
              <div className="form-group-custom" style={{ gridColumn: 'span 2' }}>
                <label className="form-label-custom">Available Days</label>
                <div className="date-tags-custom" style={{ display: 'flex', flexWrap: 'nowrap', gap: 12 }}>
                  {DAYS.map(d => (
                    <label key={d} className="skill-item-custom" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={form.availability.days.includes(d)}
                        onChange={() => toggleDay(d)}
                        className="skill-checkbox-custom"
                      />
                      <span style={{ color: '#111', fontWeight: 500 }}>{DAY_LABELS[d] || d}</span>
                    </label>
                  ))}
                </div>
                {daysError && <div style={{ color: 'red', marginTop: 8 }}>{daysError}</div>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{borderTop: '2px solid rgb(246, 190, 0)', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px'}}>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-custom btn-secondary-custom"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-custom btn-primary-custom">
              {editingId ? 'Save Changes' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* List / Results */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="profile-header" style={{ paddingBottom: 0 }}>
          <h3 style={{ marginBottom: 6 }}>Profiles</h3>
          <div className="form-row-custom" style={{ gap: 50 }}>
            <input
              className="form-control-custom"
              placeholder="Filter by city"
              value={filters.city}
              onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
            />
            <input
              className="form-control-custom"
              placeholder="Filter by skill"
              value={filters.skill}
              onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
            />
            <select
              className="form-control-custom"
              value={filters.availableOn}
              onChange={e => setFilters(f => ({ ...f, availableOn: e.target.value }))}
            >
              <option value="">Available day</option>
              {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d] || d}</option>)}
            </select>
            <button className="btn-custom btn-secondary-custom" onClick={refresh} type="button" style={{ marginBottom: 20 }}>Refresh</button>
          </div>
        </div>

        <div className="profile-body" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>{loading ? 'Loading…' : `${filteredByClient.length} of ${total} profiles`}</strong>
            <button className="btn-custom btn-secondary-custom" onClick={refresh} type="button" style={{ marginTop: 20 }}>Reload</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Skills</th>
                  <th>Preferences</th>
                  <th>Days</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredByClient.map(p => (
                  <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.location.city}{p.location.state ? `, ${p.location.state}` : ''}</td>
                    <td>{(p.skills || []).join(', ')}</td>
                    <td style={{ color: '#555' }}>{p.preferences?.notes ? p.preferences.notes : '—'}</td>
                    <td>{(p.availability?.days || []).map(d => (
                      <span key={d} style={{ color: '#111', fontWeight: 500, marginRight: 8 }}>{DAY_LABELS[d] || d}</span>
                    ))}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-custom btn-secondary-custom" onClick={() => onEdit(p.id)} type="button">Edit</button>
                      <button className="btn-custom btn-danger-custom" onClick={() => onDelete(p.id)} type="button">Delete</button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredByClient.length === 0 && (
                  <tr><td colSpan="6" style={{ padding: 12, color: '#888' }}>No profiles match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
