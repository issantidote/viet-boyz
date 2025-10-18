import * as ProfilesService from './profiles.service.js';
import * as EventsService from './events.service.js';

/**
 * Calculate match score between a volunteer profile and an event
 * @param {Object} profile - Volunteer profile
 * @param {Object} event - Event details
 * @returns {Object} - Match details with score
 */
function calculateMatch(profile, event) {
  let score = 0;
  let maxScore = 0;
  const reasons = [];
  const missing = [];

  // 1. Skills matching (40 points max)
  maxScore += 40;
  if (event.requiredSkills && event.requiredSkills.length > 0) {
    const volunteerSkills = (profile.skills || []).map(s => s.toLowerCase());
    const requiredSkills = event.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(skill => 
      volunteerSkills.some(vs => vs.includes(skill) || skill.includes(vs))
    );
    
    const skillScore = (matchedSkills.length / requiredSkills.length) * 40;
    score += skillScore;
    
    if (matchedSkills.length === requiredSkills.length) {
      reasons.push('Has all required skills');
    } else if (matchedSkills.length > 0) {
      reasons.push(`Has ${matchedSkills.length}/${requiredSkills.length} required skills`);
      const missingSkills = requiredSkills.filter(s => !matchedSkills.includes(s));
      missing.push(...missingSkills.map(s => `Missing skill: ${s}`));
    } else {
      missing.push('No matching skills');
    }
  }

  // 2. Availability matching (40 points max)
  maxScore += 40;
  if (event.eventDate && profile.availability && profile.availability.days) {
    const eventDate = new Date(event.eventDate);
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAbbr = dayOfWeek.substring(0, 3); // Mon, Tue, etc.
    
    // Check both full day names and abbreviations
    const isAvailable = profile.availability.days.some(day => 
      day.toLowerCase() === dayOfWeek.toLowerCase() || 
      day.toLowerCase() === dayAbbr.toLowerCase()
    );
    
    if (isAvailable) {
      score += 40;
      reasons.push(`Available on ${dayOfWeek}`);
    } else {
      missing.push(`Not available on ${dayOfWeek}`);
    }
  }

  // 3. Location matching (20 points max)
  maxScore += 20;
  if (event.location && profile.location && profile.location.city) {
    const eventLocation = event.location.toLowerCase();
    const volunteerCity = profile.location.city.toLowerCase();
    const volunteerState = (profile.location.state || '').toLowerCase();
    
    if (eventLocation.includes(volunteerCity) || volunteerCity.includes(eventLocation)) {
      score += 20;
      reasons.push('Same city as event');
    } else if (eventLocation.includes(volunteerState)) {
      score += 10;
      reasons.push('Same state as event');
    }
  }

  // Calculate percentage
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    volunteerId: profile.id,
    volunteerName: profile.name,
    score,
    maxScore,
    percentage,
    matchLevel: percentage >= 80 ? 'High' : percentage >= 50 ? 'Medium' : 'Low',
    reasons,
    missing,
    profile // Include full profile for reference
  };
}

/**
 * Find matching volunteers for a specific event
 * @param {string} eventId - Event ID
 * @param {Object} options - Filtering options
 * @returns {Promise<Object>} - List of matched volunteers
 */
export async function findMatchingVolunteers(eventId, options = {}) {
  // Get the event
  const event = await EventsService.getById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Get all volunteer profiles
  const { items: allProfiles } = await ProfilesService.list({ limit: 500 });
  
  // Calculate matches for each profile
  const matches = allProfiles.map(profile => calculateMatch(profile, event));

  // Filter by minimum match percentage if specified
  const minPercentage = options.minPercentage || 0;
  let filtered = matches.filter(m => m.percentage >= minPercentage);

  // Filter by match level if specified
  if (options.matchLevel) {
    filtered = filtered.filter(m => m.matchLevel === options.matchLevel);
  }

  // Sort by score (highest first)
  filtered.sort((a, b) => b.score - a.score);

  // Apply limit and offset
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  const paginatedMatches = filtered.slice(offset, offset + limit);

  return {
    eventId,
    eventName: event.eventName,
    requiredSkills: event.requiredSkills || [],
    eventDate: event.eventDate,
    location: event.location,
    totalMatches: filtered.length,
    matches: paginatedMatches,
    stats: {
      high: matches.filter(m => m.matchLevel === 'High').length,
      medium: matches.filter(m => m.matchLevel === 'Medium').length,
      low: matches.filter(m => m.matchLevel === 'Low').length
    }
  };
}

/**
 * Get match score for a specific volunteer-event pair
 * @param {string} volunteerId - Volunteer profile ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Match details
 */
export async function getMatchScore(volunteerId, eventId) {
  const event = await EventsService.getById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const profile = await ProfilesService.getById(volunteerId);
  if (!profile) {
    throw new Error('Volunteer profile not found');
  }

  return calculateMatch(profile, event);
}

/**
 * Find all events that match a volunteer's profile
 * @param {string} volunteerId - Volunteer profile ID
 * @param {Object} options - Filtering options
 * @returns {Promise<Object>} - List of matched events
 */
export async function findMatchingEvents(volunteerId, options = {}) {
  // Get the volunteer profile
  const profile = await ProfilesService.getById(volunteerId);
  if (!profile) {
    throw new Error('Volunteer profile not found');
  }

  // Get all events
  const { items: allEvents } = await EventsService.list({ limit: 500 });

  // Calculate matches for each event
  const matches = allEvents.map(event => {
    const match = calculateMatch(profile, event);
    return {
      ...match,
      eventId: event.id,
      eventName: event.eventName,
      eventDescription: event.eventDescription,
      eventDate: event.eventDate,
      location: event.location,
      urgency: event.urgency
    };
  });

  // Filter by minimum match percentage if specified
  const minPercentage = options.minPercentage || 0;
  let filtered = matches.filter(m => m.percentage >= minPercentage);

  // Filter by match level if specified
  if (options.matchLevel) {
    filtered = filtered.filter(m => m.matchLevel === options.matchLevel);
  }

  // Sort by score (highest first)
  filtered.sort((a, b) => b.score - a.score);

  // Apply limit and offset
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  const paginatedMatches = filtered.slice(offset, offset + limit);

  return {
    volunteerId,
    volunteerName: profile.name,
    totalMatches: filtered.length,
    matches: paginatedMatches
  };
}

