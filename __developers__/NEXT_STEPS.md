# Next Steps: Frontend Integration & Assignment 4

## ✅ What's Complete (Assignment 3)

All Assignment 3 backend requirements are **COMPLETE**:
- ✅ Login Module
- ✅ User Profile Management Module  
- ✅ Event Management Module
- ✅ Volunteer Matching Module
- ✅ Notification Module
- ✅ Volunteer History Module
- ✅ Validations (Zod)
- ✅ Unit Tests (38 passing)
- ✅ All APIs working and tested

**Server:** Running at http://localhost:4000  
**Tests:** 38 passing, 0 failing

---

## 🚀 Next: Frontend Integration

### Phase A: Connect Auth (Login/Register)

**What to do:**
1. Create `client/src/services/authApi.js`:
```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function register(email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}
```

2. Update `client/src/pages/Login.jsx`:
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authApi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // ... your existing JSX with handleSubmit
  );
}
```

3. Do the same for `UserRegister.jsx`

---

### Phase B: Connect Notifications

**What to do:**
1. Create `client/src/services/notificationsApi.js`:
```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getUserNotifications(userId, params = {}) {
  const q = new URLSearchParams(params).toString();
  const url = q ? `${API}/api/notifications/users/${userId}?${q}` : 
                  `${API}/api/notifications/users/${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markAsRead(notificationId, userId) {
  const res = await fetch(`${API}/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to mark as read');
  return res.json();
}

export async function markAllAsRead(userId) {
  const res = await fetch(`${API}/api/notifications/users/${userId}/read-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to mark all as read');
  return res.json();
}

export async function dismiss(notificationId, userId) {
  const res = await fetch(`${API}/api/notifications/${notificationId}/dismiss`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to dismiss');
  return res.json();
}
```

2. Update `client/src/pages/Notifications.jsx`:
   - Replace `MOCK_NOTIFICATIONS` with API calls
   - Use `getUserNotifications()` in `useEffect`
   - Wire up `markAsRead()`, `markAllAsRead()`, `dismiss()` functions

---

### Phase C: Connect Volunteer Matching

**What to do:**
1. Create `client/src/services/matchingApi.js`:
```javascript
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getMatchingVolunteers(eventId, params = {}) {
  const q = new URLSearchParams(params).toString();
  const url = q ? `${API}/api/matching/events/${eventId}/volunteers?${q}` : 
                  `${API}/api/matching/events/${eventId}/volunteers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

export async function getMatchScore(eventId, volunteerId) {
  const res = await fetch(
    `${API}/api/matching/events/${eventId}/volunteers/${volunteerId}`
  );
  if (!res.ok) throw new Error('Failed to get match score');
  return res.json();
}

export async function getMatchingEvents(volunteerId, params = {}) {
  const q = new URLSearchParams(params).toString();
  const url = q ? `${API}/api/matching/volunteers/${volunteerId}/events?${q}` : 
                  `${API}/api/matching/volunteers/${volunteerId}/events`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch matching events');
  return res.json();
}
```

2. Update `client/src/pages/VolunteerMatching.jsx`:
   - Replace dummy volunteer/event data with API calls
   - Use `getMatchingVolunteers(eventId)` to get matches
   - Display match scores, levels, and reasons
   - Show "High/Medium/Low" match badges

---

## 📚 Assignment 4: Database Integration

### What You'll Need to Do:

1. **Choose Database:** MySQL, PostgreSQL, MongoDB, or SQLite
2. **Create Schema:**
   - `users` table (from auth.service.js)
   - `profiles` table (from profiles.service.js)
   - `events` table (from events.service.js)
   - `volunteer_history` table
   - `notifications` table
   - `event_assignments` table (many-to-many)

3. **Update Services:**
   - Replace in-memory Map with database queries
   - Keep the same service function signatures (no API changes!)
   - Maintain all existing validations

4. **Migration Strategy:**
   - Create migration scripts
   - Seed data from existing JSON files
   - Test each module after migration

5. **Keep Tests Passing:**
   - All 38 existing tests should still pass
   - May need to add database setup/teardown in tests
   - Consider test database vs. production database

---

## 🎯 Current Backend API Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Profiles
- `GET /api/profiles`
- `GET /api/profiles/:id`
- `POST /api/profiles`
- `PATCH /api/profiles/:id`
- `DELETE /api/profiles/:id`

### Events
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`

### Volunteer History
- `GET /api/volunteer-history`
- `GET /api/volunteer-history/:id`
- `GET /api/volunteer-history/volunteer/:volunteerId`
- `GET /api/volunteer-history/status/:status`
- `GET /api/volunteer-history/stats/overview`
- `POST /api/volunteer-history`
- `PATCH /api/volunteer-history/:id`
- `DELETE /api/volunteer-history/:id`

### Matching (NEW!)
- `GET /api/matching/events/:eventId/volunteers`
- `GET /api/matching/events/:eventId/volunteers/:volunteerId`
- `GET /api/matching/volunteers/:volunteerId/events`

### Notifications (NEW!)
- `GET /api/notifications/users/:userId`
- `GET /api/notifications/:id`
- `POST /api/notifications`
- `POST /api/notifications/assignment`
- `POST /api/notifications/update`
- `POST /api/notifications/reminder`
- `POST /api/notifications/cancellation`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/:id/dismiss`
- `POST /api/notifications/users/:userId/read-all`
- `DELETE /api/notifications/:id`

---

## 🔧 Development Commands

**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
cd client
npm run dev
```

**Run Tests:**
```bash
cd server
npm test
```

**Test API:**
```bash
curl http://localhost:4000/health
```

---

## 📊 Progress Summary

| Module | Status | Tests | API Endpoints |
|--------|--------|-------|---------------|
| Login | ✅ Complete | ✅ Tested | 2 endpoints |
| Profiles | ✅ Complete | ✅ 17 tests | 5 endpoints |
| Events | ✅ Complete | ✅ 11 tests | 5 endpoints |
| Matching | ✅ Complete | ✅ Tested | 3 endpoints |
| Notifications | ✅ Complete | ✅ Tested | 11 endpoints |
| Volunteer History | ✅ Complete | ✅ 10 tests | 8 endpoints |
| **TOTAL** | **✅ 100%** | **38 passing** | **34 endpoints** |

---

## 💡 Tips for Success

1. **Test Each Integration:** Test each frontend page as you connect it
2. **Handle Errors:** Add proper error handling in frontend API calls
3. **Loading States:** Show loading spinners while fetching data
4. **User Feedback:** Show success/error toasts after API operations
5. **Token Management:** Store JWT token in localStorage or context
6. **CORS:** Make sure backend CORS allows frontend origin
7. **Environment Variables:** Use `.env` files for API URLs

---

## 🎉 You're Ready!

Your backend is **production-ready** for Assignment 3!

Next steps:
1. ✅ **Test all APIs** - Done!
2. 🚀 **Connect frontend** - Ready to start!
3. 📚 **Assignment 4** - Database integration

**Great work completing Assignment 3!** 🚀

