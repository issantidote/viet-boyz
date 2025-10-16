# Assignment 1: Initial Thoughts and Design

Description

In this assignment we will come up with initial design for a software application that you will build in this semester. We will not be writing any code in this assignment, but only looking at some initial design ideas and high-level design.

Problem Statement

A non-profit organization has requested to build a software application that will help manage and optimize their volunteer activities. The application should help the organization efficiently allocate volunteers to different events and tasks based on their preferences, skills, and availability. The application should consider the following criteria:

Volunteer’s location
Volunteer’s skills and preferences
Volunteer’s availability
Event requirements and location
Task urgency and priority
The software must include the following components:

Login (Allow volunteers and administrators to register if not already registered)
User Registration (Initially only username and password, followed by email verification)
User Profile Management (After registration, users should log in to complete their profile, including location, skills, preferences, and availability)
Event Management (Administrators can create and manage events, specifying required skills, location, and urgency)
Volunteer Matching (A module that matches volunteers to events/tasks based on their profiles and the event requirements)
Notification System (Send notifications to volunteers for event assignments, updates, and reminders)
Volunteer History (Track volunteer participation history and performance)


# Assignment 2: Front-End Development

Description

In this assignment, you will build the front end for the web or mobile application that you designed in Assignment 1. Remember, we are only focusing on the front end in this assignment.

Problem Statement

Same as Assignment 1.

Additional Details

Front end must include the following components:

Login (Allow volunteers and administrators to register if not registered yet)
User Registration (Initially only username (use email) and password)
User Profile Management (After registration, users should log in first to complete their profile). Following fields will be on the profile page/form:
Full Name (50 characters, required)
Address 1 (100 characters, required)
Address 2 (100 characters, optional)
City (100 characters, required)
State (Drop Down, selection required) DB will store 2-character state code
Zip code (9 characters, at least 5-character code required)
Skills (multi-select dropdown, required)
Preferences (Text area, optional)
Availability (Date picker, multiple dates allowed, required)
Event Management Form (Administrators can create and manage events). The form should include:
Event Name (100 characters, required)
Event Description (Text area, required)
Location (Text area, required)
Required Skills (Multi-select dropdown, required)
Urgency (Drop down, selection required)
Event Date (Calendar, date picker)
Volunteer Matching Form (A form where administrators can view and match volunteers to events based on their profiles and event requirements):
Volunteer Name (Auto-fill from database)
Matched Event (Auto-fill from database based on volunteer's profile)
Notification System
Display notifications for new event assignments, updates, and reminders
Volunteer History
Tabular display of all volunteer participation history. All fields from Event Management are displayed, along with volunteer’s participation status.
You should have validations in place for required fields, field types, and field lengths.


# Assignment 3: Back-End Development
Description
In this assignment, you will build the back end for the web or mobile application that you designed in Assignment 1. Remember, we are only focusing on the back end in this assignment.

Problem Statement
Same as assignment 1.

Additional Details
Back end must include the following components/modules:

Login Module: Handle user authentication, registration, and login functionality.
User Profile Management Module: Manage user profile data, including location, skills, preferences, and availability.
Event Management Module: Create and manage events, including required skills, location, urgency, and event details.
Volunteer Matching Module: Implement logic to match volunteers to events based on their profiles and event requirements.
Notification Module: Logic to send notifications to volunteers for event assignments, updates, and reminders.
Volunteer History Module: Track and display volunteer participation history.
Important Deliverables
Validations: Ensure validations are in place for required fields, field types, and field lengths in the backend code.
Unit Tests: All backend code should be covered by unit tests. Code coverage should be greater than 80%. Research how to run the code coverage reports. Each IDE has plugins to generate reports. Here are a few pointers: Stackify Code Coverage Tools Links to an external site.
Integration with Front End: All front-end components should be connected to the back end. Form data should be populated from the back end. The back end should receive data from the front end, validate it, and prepare it to persist to the database.
No Database Implementation: We are not implementing the database yet. For this assignment, you can hard code the values.

# Assignment 4: Database Implementation
Description
In this assignment, you will create the database and connect it to your web or mobile application. You can use any type of database, either RDBMS or NoSQL.

Problem Statement
Same as Assignment 1. 

Additional Details
You can use RDBMS or NoSQL database.

Database must include the following tables/documents:

UserCredentials: (ID & password), password should be encrypted.
UserProfile: Stores user details like full name, address, city, state, zipcode, skills, preferences, and availability.
EventDetails: Stores details of the events such as event name, description, location, required skills, urgency, and event date.
VolunteerHistory: Tracks volunteer participation in events.
States: Stores state codes and names (if required).
Important Deliverables
Validations: Ensure validations are in place for required fields, field types, and field lengths.
Data Retrieval and Display: Backend should retrieve data from the database and display it to the front end.
Data Persistence: Form data should be populated from the backend. The backend should receive data from the front end, validate it, and persist it to the database.
Unit Tests: Any new code added should be covered by unit tests. Keep code coverage above 80%.
Pointers/Guidelines for Choosing a Database
RDBMS: If you choose a relational database, consider using MySQL, PostgreSQL, or SQLite. These databases are great for structured data with complex relationships.

Example: MySQL, PostgreSQL
Benefits: ACID compliance, complex queries, and relationships.
Drawbacks: Requires schema definition, less flexible with unstructured data.
NoSQL: If you choose a NoSQL database, consider using MongoDB or Firebase. These databases are great for unstructured data and flexible schemas.

Example: MongoDB, Firebase
Benefits: Flexible schema, easy scalability, and handling unstructured data.
Drawbacks: Less suitable for complex queries and transactions.