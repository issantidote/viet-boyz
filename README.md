// TODO:  read me file is a little messy 

# Getting Started Front End
Prerequisites
- Node.js: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- Docker: Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop). // unsure if we need this. haven't decided hosting service yet. 

Installation
1. Clone the Repository:
   ```
   git clone https://github.com/issantidote/viet-boyz.git
   cd viet-boyz/client
   ```

2. Install Dependencies:
   ```
   npm install
   ```

// TODO: remove? 
3. Run with Docker:
   - Build and start the Docker container:
     ```
     docker-compose up --build
     ```

Running Locally
- Start the Development Server:
  ```
  cd client && npm run dev
  ```

# Handling Dependency Issues
Delete and reinstall dependencies
```
rm -rf node_modules
npm install
```

Clear npm Cache
```
npm cache clean --force
```

# Naming files and folders
- Use Kebab Case for folder names. Example: user-profile, event-management
- Use Pascal Case for component files. Ex: LoginForm.jsx, UserProfilePage.jsx
- Use Camel case for non-component files (like hooks, utility, stuff related to api i think). Ex: apiService.jsx, useAuth.js
- Use UPPERCASE_SNAKE_CASE for hardcoded constants

# File System
src/
  ├── components/          # Reusable UI components
  │   ├── common/          # Common components (e.g., buttons, inputs)
  │   ├── auth/            # Authentication components (e.g., login, registration)
  │   ├── profile/         # User profile components
  │   ├── events/          # Event management components
  │   ├── notifications/   # Notification components
  │   └── history/         # Volunteer history components
  ├── pages/               # Page components (e.g., Home, Dashboard)
  ├── hooks/               # Custom React hooks
  ├── context/             # Context API for global state management, FOLDER NOT MADE YET
  ├── services/            # API service calls
  ├── utils/               # Utility functions
  ├── styles/              # Global styles and theme
  ├── assets/              # Static assets (e.g., images, fonts)
  ├── App.jsx              # Main application component
  └── index.jsx            # Entry point




# Getting Started Backend
Installation
1. Install Dependencies 
```
cd server
npm install
```

2. Install Test Dependencies (mocha)
```
npm install --save-dev mocha supertest
// 'supertest' is optional and is for HTTP testing
```

3. Create your first test
// TODO: more documentation on that
I ran 'npm test' in 'cd server'

Project Layout (Backend)
server/
  src/
    index.js
    routes/
    ...
  test/
    sample.test.js
  package.json
  package-lock.json
  .mocharc.json   # optional, for Mocha config
  .env            # optional

