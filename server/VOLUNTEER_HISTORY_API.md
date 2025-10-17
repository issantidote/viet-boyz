# Volunteer History Backend API Documentation

## Overview

The Volunteer History backend provides a comprehensive API for tracking and managing volunteer participation history. It follows the same architectural patterns as the existing UserProfileManagement system, ensuring consistency and maintainability.

## API Endpoints

### Base Path: `/api/volunteer-history`

#### Core CRUD Operations

- **GET** `/api/volunteer-history` - List volunteer history events with filtering
- **GET** `/api/volunteer-history/:id` - Get specific event by ID
- **POST** `/api/volunteer-history` - Create new volunteer history event (requires API key)
- **PATCH** `/api/volunteer-history/:id` - Update existing event (requires API key)
- **DELETE** `/api/volunteer-history/:id` - Delete event (requires API key)

#### Specialized Endpoints

- **GET** `/api/volunteer-history/volunteer/:volunteerId` - Get all events for a specific volunteer
- **GET** `/api/volunteer-history/status/:status` - Get events by status (Started, Not Start, Done)
- **GET** `/api/volunteer-history/stats/overview` - Get statistics overview

## Data Schema

### Volunteer History Event Object

```javascript
{
  "id": "string",              // Auto-generated UUID
  "name": "string",            // Event name (max 100 chars)
  "description": "string",     // Event description
  "location": "string",        // Event location
  "requiredSkills": ["string"], // Array of required skills (min 1)
  "urgency": "High|Medium|Low", // Event urgency level
  "status": "Started|Not Start|Done", // Participation status
  "eventDate": "ISO string",   // Optional event date
  "volunteerId": "string",     // Optional volunteer ID link
  "organizerId": "string",     // Optional organizer ID link
  "participationHours": "number", // Optional hours contributed
  "notes": "string",           // Optional participation notes
  "createdAt": "ISO string",   // Auto-generated creation timestamp
  "updatedAt": "ISO string"    // Auto-generated update timestamp
}
```

## Query Parameters

### List Filtering (`GET /api/volunteer-history`)

- `name` - Filter by event name (partial match)
- `location` - Filter by location (partial match)  
- `skill` - Filter by required skill
- `urgency` - Filter by urgency level (High, Medium, Low)
- `status` - Filter by participation status (Started, Not Start, Done)
- `volunteerId` - Filter by volunteer ID
- `q` - General search across name, description, location, skills, and notes
- `limit` - Limit results (max 200, default 50)
- `offset` - Offset for pagination (default 0)

### Example Queries

```
GET /api/volunteer-history?status=Done&limit=10
GET /api/volunteer-history?urgency=High&q=food
GET /api/volunteer-history?volunteerId=vol-123&status=Started
```

## Backend Architecture

### Files Structure

```
server/src/
├── validations/volunteerHistory.schemas.js    # Zod validation schemas
├── services/volunteerHistory.service.js       # Business logic layer
├── controllers/volunteerHistory.controller.js # Request handlers
├── routes/volunteerHistory.routes.js          # Route definitions
└── index.js                                   # Updated to mount routes

server/
├── volunteerHistory.data.json                 # File-based persistence
└── test/VolunteerHistory.test.js              # Comprehensive test suite
```

### Key Features

1. **Validation**: Comprehensive Zod schemas for input validation
2. **Caching**: Memoized list queries for performance
3. **Persistence**: File-based storage with automatic persistence
4. **Filtering**: Multiple filter options with efficient matching
5. **Authentication**: API key protection for write operations
6. **Testing**: Complete test coverage with Mocha

### Integration with Frontend

The backend is designed to work seamlessly with the existing `VolunteerHistory.jsx` component. The frontend expects an `events` prop with the following structure that matches our API response:

```javascript
const events = [
  {
    name: "Event Name",
    description: "Description",
    location: "Location",
    requiredSkills: ["Skill1", "Skill2"],
    urgency: "High|Medium|Low",
    status: "Started|Not Start|Done"
  }
];
```

### Sample API Usage

```javascript
// Fetch volunteer history for display
const response = await fetch('/api/volunteer-history?limit=20');
const { items, total } = await response.json();

// Create new volunteer history entry
const newEvent = {
  name: "Beach Cleanup",
  description: "Clean up trash along the beach",
  location: "Galveston Beach",
  requiredSkills: ["Outdoor", "Environmental"],
  urgency: "Medium",
  status: "Not Start"
};

await fetch('/api/volunteer-history', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify(newEvent)
});
```

## Testing

Run the comprehensive test suite with:

```bash
cd server
npm test -- --grep "Volunteer History"
```

The tests cover:
- Full CRUD operations
- Input validation
- Query filtering
- Authentication requirements
- Error handling
- Specialized endpoints
- Statistics generation