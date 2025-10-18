import * as MatchingService from '../services/matching.service.js';

/**
 * Get matching volunteers for a specific event
 * GET /api/matching/events/:eventId/volunteers
 */
export const getMatchingVolunteers = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const options = {
      minPercentage: req.query.minPercentage ? parseInt(req.query.minPercentage) : 0,
      matchLevel: req.query.matchLevel,
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };

    const result = await MatchingService.findMatchingVolunteers(eventId, options);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Get match score for a specific volunteer-event pair
 * GET /api/matching/events/:eventId/volunteers/:volunteerId
 */
export const getMatchScore = async (req, res, next) => {
  try {
    const { eventId, volunteerId } = req.params;
    const result = await MatchingService.getMatchScore(volunteerId, eventId);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Get matching events for a specific volunteer
 * GET /api/matching/volunteers/:volunteerId/events
 */
export const getMatchingEvents = async (req, res, next) => {
  try {
    const { volunteerId } = req.params;
    const options = {
      minPercentage: req.query.minPercentage ? parseInt(req.query.minPercentage) : 0,
      matchLevel: req.query.matchLevel,
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };

    const result = await MatchingService.findMatchingEvents(volunteerId, options);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

