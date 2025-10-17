// server/src/controllers/volunteerHistory.controller.js
import * as svc from '../services/volunteerHistory.service.js';

export const list = async (req, res, next) => {
  try {
    const query = req.validatedQuery || req.query || {};
    const userId = req.user?.id;
    const data = await svc.list(query, userId);
    res.json(data);
  } catch (e) { 
    next(e); 
  }
};

export const getById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const event = await svc.getById(req.params.id, userId);
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
    const userId = req.user?.id;
    const newEvent = await svc.create(req.body, userId);
    res.status(201).json(newEvent);
  } catch (e) { 
    next(e); 
  }
};

export const update = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const updated = await svc.update(req.params.id, req.body, userId);
    if (!updated) {
      return res.status(404).json({ error: 'Volunteer history event not found or access denied' });
    }
    res.json(updated);
  } catch (e) { 
    next(e); 
  }
};

export const remove = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const ok = await svc.remove(req.params.id, userId);
    if (!ok) {
      return res.status(404).json({ error: 'Volunteer history event not found or access denied' });
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