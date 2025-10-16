### Good Git Practices

1) Creating New Branch
```
git checkout main                      # ensure you're on main
git fetch origin                       # fetch latest refs from remote
git pull origin main                   # update local main
git checkout -b yourname/feature-xyz   # create & switch to a new branch
```

2) Every Day Git Flow
```
git status                               # see what changed
git add .                                 # stage all modified/new files
git commit -m "feat: short, clear message"  # commit your work
git push -u origin your-branch-name       # first push sets upstream; later just `git push`
```
Then open git UI to make a pull and request. Please document what changes you did so other developers can understand what's happening. 


### Naming files and folders
- Use Kebab Case for folder names. Example: user-profile, event-management
- Use Pascal Case for component files. Ex: LoginForm.jsx, UserProfilePage.jsx
- Use Camel case for non-component files (like hooks, utility, stuff related to api i think). Ex: apiService.jsx, useAuth.js
- Use UPPERCASE_SNAKE_CASE for hardcoded constants


### Troubleshooting (Caches & Dependencies)

Run these per project (`client/` and `server/`), not at the repo root.

- macOS/Linux:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

- Windows (Command Prompt):
```bat
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

- Windows (PowerShell):
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

Tips:
- Ensure Node ≥ 18: `node -v`
- Run `npm test` from `server/` (Mocha is a devDependency there).
- If a POST fails validation for availability days, use abbreviations: `['Mon','Tue','Wed','Thu','Fri','Sat','Sun']`.


### Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express (ESM) with Zod validation
- Data: In-memory store persisted to `server/profiles.data.json` (file-based), `mysql2` ready for future DB
- Testing: Mocha + Chai + Supertest (server)

### Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/health