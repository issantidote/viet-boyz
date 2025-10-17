// server/src/controllers/volunteerHistory.controller.js
import * as svc from '../services/volunteerHistory.service.js';

export const list = async (req, res, next) => {
  try {
    const query = req.validatedQuery || req.query || {};
    const data = await svc.list(query);
    res.json(data);
  } catch (e) { 
    next(e); 
  }
};

export const getById = async (req, res, next) => {
  try {
    const event = await svc.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Volunteer history event not found' });
    }
    res.json(event);
  } catch (e) { 
    next(e); 
  }
};

export const create = async (req, res, next) => {
  try {
    const newEvent = await svc.create(req.body);
    res.status(201).json(newEvent);
  } catch (e) { 
    next(e); 
  }
};

export const update = async (req, res, next) => {
  try {
    const updated = await svc.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Volunteer history event not found' });
    }
    res.json(updated);
  } catch (e) { 
    next(e); 
  }
};

export const remove = async (req, res, next) => {
  try {
    const ok = await svc.remove(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Volunteer history event not found' });
    }
    res.status(204).send();
  } catch (e) { 
    next(e); 
  }
};

// Additional controller functions specific to volunteer history

export const getByVolunteerId = async (req, res, next) => {
  try {
    const events = await svc.getByVolunteerId(req.params.volunteerId);
    res.json({ items: events, total: events.length });
  } catch (e) { 
    next(e); 
  }
};

export const getByStatus = async (req, res, next) => {
  try {
    const events = await svc.getByStatus(req.params.status);
    res.json({ items: events, total: events.length });
  } catch (e) { 
    next(e); 
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const stats = await svc.getStatistics();
    res.json(stats);
  } catch (e) { 
    next(e); 
  }
};