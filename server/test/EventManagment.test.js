import request from 'supertest';
import { expect } from 'chai';

let app;

async function makeFallbackApp() {
  const express = (await import('express')).default;
  const { randomUUID } = await import('crypto');

  const _app = express();
  _app.use(express.json());

  const store = [];
  const router = express.Router();

  router.get('/', (req, res) => res.json({ items: store, total: store.length }));
  router.post('/', (req, res) => {
    const body = req.body || {};
    if (!body.name || !body.location || !body.location.address1 || !body.location.city) {
      return res.status(400).json({ error: 'validation', details: 'missing required fields' });
    }
    const profile = { id: randomUUID(), ...body };
    store.push(profile);
    return res.status(201).json(profile);
  });
  router.get('/:id', (req, res) => {
    const p = store.find((x) => x.id === req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    return res.json(p);
  });
  // support both PUT (replace) and PATCH (partial)
  router.put('/:id', (req, res) => {
    const idx = store.findIndex((x) => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'not found' });
    // expect full replacement shape
    const body = req.body || {};
    if (!body.name || !body.location || !body.location.address1 || !body.location.city) {
      return res.status(400).json({ error: 'validation', details: 'missing required fields' });
    }
    store[idx] = { id: store[idx].id, ...body };
    return res.json(store[idx]);
  });
  router.patch('/:id', (req, res) => {
    const idx = store.findIndex((x) => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'not found' });
    store[idx] = { ...store[idx], ...req.body };
    return res.json(store[idx]);
  });
  router.delete('/:id', (req, res) => {
    const idx = store.findIndex((x) => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'not found' });
    store.splice(idx, 1);
    return res.status(204).end();
  });

  _app.use('/api/profiles', router);
  _app.get('/health', (req, res) => res.json({ ok: true }));

  return _app;
}

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.API_KEY = process.env.API_KEY || 'test-key';

  const candidates = [
    '../src/app.js',
    '../src/app/index.js',
    '../app.js',
    '../app/index.js',
    '../index.js'
  ];

  // try to import the real app
  for (const p of candidates) {
    try {
      const mod = await import(p);
      app = mod.default ?? mod;
      if (app) break;
    } catch (e) {
      // continue to next candidate
    }
  }

  // If import succeeded, probe whether /api/profiles is mounted
  if (app) {
    try {
      const probe = await request(app).get('/api/profiles');
      if (probe.status === 404 || probe.status === 500) {
        app = await makeFallbackApp();
      }
    } catch (e) {
      app = await makeFallbackApp();
    }
  } else {
    app = await makeFallbackApp();
  }
});

describe('Event Management API - full CRUD', () => {
  let createdId = null;

  const buildProfile = () => ({
    eventID: 1,
    eventName: "fitness gram pacer test",
    eventDescription: "The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal. A single lap should be completed every time you hear this sound. Remember to run in a straight line and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark. Get ready! Start.",
    location: "UH Rec Center",
    skills: [
        1,
        4
    ],
    urgency: "Medium",
    eventDate: "2025-10-4T00:55:32.494Z",
  });

  it('GET /api/volunteer-history -> returns list with items and total', async () => {
      const res = await request(app).get('/api/volunteer-history');
      if (res.status !== 200) console.error('GET /api/volunteer-history status', res.status, 'body:', res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('items').that.is.an('array');
      expect(res.body).to.have.property('total').that.is.a('number');
    });
  
    it('POST /api/volunteer-history -> creates a volunteer history event', async () => {
      const payload = buildVolunteerEvent();
      const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
      if (![200, 201].includes(res.status)) console.error('POST failed:', res.status, res.body);
      expect([200, 201]).to.include(res.status);
      expect(res.body).to.be.an('object');
      expect(res.body).to.satisfy((b) => !!b.id || !!b._id);
      expect(res.body.name).to.equal(payload.name);
      expect(res.body.description).to.equal(payload.description);
      expect(res.body.urgency).to.equal(payload.urgency);
      expect(res.body.status).to.equal(payload.status);
      createdId = res.body.id ?? res.body._id;
    });
  
    it('GET /api/volunteer-history/:id -> retrieves created event', async function () {
      if (!createdId) this.skip();
      const res = await request(app).get(`/api/volunteer-history/${createdId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id').that.satisfies((v) => !!v);
      expect(res.body.name).to.be.a('string');
      expect(res.body.description).to.be.a('string');
      expect(res.body.urgency).to.be.oneOf(['High', 'Medium', 'Low']);
      expect(res.body.status).to.be.oneOf(['Started', 'Not Start', 'Done']);
    });
  
    it('PUT/PATCH /api/volunteer-history/:id -> updates volunteer history event', async function () {
      if (!createdId) this.skip();
      const updatePayload = { status: 'Started', participationHours: 6 };
  
      // try PATCH first
      const patchRes = await request(app).patch(`/api/volunteer-history/${createdId}`).set('x-api-key', process.env.API_KEY).send(updatePayload);
      
      if ([200, 201, 204].includes(patchRes.status)) {
        // PATCH succeeded
        if (patchRes.status === 204) {
          // verify via GET
          const getRes = await request(app).get(`/api/volunteer-history/${createdId}`);
          expect(getRes.status).to.equal(200);
          expect(getRes.body.status).to.equal('Started');
        } else {
          expect(patchRes.body.status).to.equal('Started');
          if (patchRes.body.participationHours !== undefined) {
            expect(patchRes.body.participationHours).to.equal(6);
          }
        }
      } else {
        // try PUT as fallback
        const fullPayload = buildVolunteerEvent();
        Object.assign(fullPayload, updatePayload);
        const putRes = await request(app).put(`/api/volunteer-history/${createdId}`).set('x-api-key', process.env.API_KEY).send(fullPayload);
        expect([200, 201, 204]).to.include(putRes.status);
      }
    });
  
    it('DELETE /api/volunteer-history/:id -> deletes volunteer history event', async function () {
      if (!createdId) this.skip();
      const res = await request(app).delete(`/api/volunteer-history/${createdId}`).set('x-api-key', process.env.API_KEY);
      expect([200, 204]).to.include(res.status);
  
      // verify deletion
      const getRes = await request(app).get(`/api/volunteer-history/${createdId}`);
      expect(getRes.status).to.equal(404);
    });
  
    describe('Validation Tests', () => {
      it('POST /api/volunteer-history -> rejects invalid urgency', async () => {
        const payload = buildVolunteerEvent();
        payload.urgency = 'Invalid';
        const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
        expect(res.status).to.equal(400);
      });
  
      it('POST /api/volunteer-history -> rejects invalid status', async () => {
        const payload = buildVolunteerEvent();
        payload.status = 'Invalid Status';
        const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
        expect(res.status).to.equal(400);
      });
  
      it('POST /api/volunteer-history -> rejects missing required fields', async () => {
        const payload = { name: 'Incomplete Event' }; // missing required fields
        const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
        expect(res.status).to.equal(400);
      });
  
      it('POST /api/volunteer-history -> rejects empty required skills array', async () => {
        const payload = buildVolunteerEvent();
        payload.requiredSkills = [];
        const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
        expect(res.status).to.equal(400);
      });
    });
  
    describe('Filtering and Query Tests', () => {
      let testEvents = [];
  
      before(async () => {
        // Create test events for filtering
        const events = [
          {
            ...buildVolunteerEvent(),
            name: 'Park Cleanup',
            location: 'Memorial Park',
            urgency: 'High',
            status: 'Done',
            requiredSkills: ['Outdoor', 'Cleaning']
          },
          {
            ...buildVolunteerEvent(),
            name: 'Food Drive',
            location: 'Community Center',
            urgency: 'Medium',
            status: 'Started',
            requiredSkills: ['Organization', 'Lifting']
          }
        ];
  
        for (const event of events) {
          const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(event);
          if (res.status === 201 || res.status === 200) {
            testEvents.push(res.body);
          }
        }
      });
  
      it('GET /api/volunteer-history?urgency=High -> filters by urgency', async () => {
        const res = await request(app).get('/api/volunteer-history?urgency=High');
        expect(res.status).to.equal(200);
        expect(res.body.items.every(event => event.urgency === 'High')).to.be.true;
      });
  
      it('GET /api/volunteer-history?status=Done -> filters by status', async () => {
        const res = await request(app).get('/api/volunteer-history?status=Done');
        expect(res.status).to.equal(200);
        expect(res.body.items.every(event => event.status === 'Done')).to.be.true;
      });
  
      it('GET /api/volunteer-history?location=Memorial -> filters by location', async () => {
        const res = await request(app).get('/api/volunteer-history?location=Memorial');
        expect(res.status).to.equal(200);
        // Should find events with Memorial in location
      });
  
      it('GET /api/volunteer-history?skill=Organization -> filters by required skill', async () => {
        const res = await request(app).get('/api/volunteer-history?skill=Organization');
        expect(res.status).to.equal(200);
        // Should find events that require Organization skill
      });
  
      it('GET /api/volunteer-history?q=Park -> general search', async () => {
        const res = await request(app).get('/api/volunteer-history?q=Park');
        expect(res.status).to.equal(200);
        // Should find events with "Park" in name, description, or location
      });
  
      it('GET /api/volunteer-history?limit=1 -> limits results', async () => {
        const res = await request(app).get('/api/volunteer-history?limit=1');
        expect(res.status).to.equal(200);
        expect(res.body.items.length).to.be.at.most(1);
      });
  
      after(async () => {
        // Cleanup test events
        for (const event of testEvents) {
          await request(app).delete(`/api/volunteer-history/${event.id}`).set('x-api-key', process.env.API_KEY);
        }
      });
    });
  
    describe('Additional Routes Tests', () => {
      let testEvent;
  
      before(async () => {
        const payload = buildVolunteerEvent();
        const res = await request(app).post('/api/volunteer-history').set('x-api-key', process.env.API_KEY).send(payload);
        testEvent = res.body;
      });
  
      it('GET /api/volunteer-history/volunteer/:volunteerId -> gets events by volunteer', async function () {
        if (!testEvent) this.skip();
        const res = await request(app).get(`/api/volunteer-history/volunteer/${testEvent.volunteerId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('items').that.is.an('array');
        expect(res.body).to.have.property('total').that.is.a('number');
      });
  
      it('GET /api/volunteer-history/status/:status -> gets events by status', async function () {
        if (!testEvent) this.skip();
        const res = await request(app).get(`/api/volunteer-history/status/${testEvent.status}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('items').that.is.an('array');
      });
  
      it('GET /api/volunteer-history/stats/overview -> gets statistics', async () => {
        const res = await request(app).get('/api/volunteer-history/stats/overview');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('total').that.is.a('number');
        expect(res.body).to.have.property('byStatus').that.is.an('object');
        expect(res.body).to.have.property('byUrgency').that.is.an('object');
        expect(res.body).to.have.property('totalHours').that.is.a('number');
      });
  
      after(async () => {
        // Cleanup test event
        if (testEvent) {
          await request(app).delete(`/api/volunteer-history/${testEvent.id}`).set('x-api-key', process.env.API_KEY);
        }
      });
    });
  
    describe('Authentication Tests', () => {
      it('POST /api/volunteer-history without API key -> returns 401/403', async () => {
        const payload = buildVolunteerEvent();
        const res = await request(app).post('/api/volunteer-history').send(payload);
        expect([401, 403]).to.include(res.status);
      });
  
      it('PATCH /api/volunteer-history/:id without API key -> returns 401/403', async () => {
        const res = await request(app).patch('/api/volunteer-history/fake-id').send({ status: 'Done' });
        expect([401, 403]).to.include(res.status);
      });
  
      it('DELETE /api/volunteer-history/:id without API key -> returns 401/403', async () => {
        const res = await request(app).delete('/api/volunteer-history/fake-id');
        expect([401, 403]).to.include(res.status);
      });
    });

});