const fs = require('fs');
const path = require('path');

const frontendDist = path.join(__dirname, '../../frontend/dist');
const backendDist = path.join(__dirname, '../dist');

console.log('Copying frontend build to backend/dist...');

// Check if frontend dist exists
if (!fs.existsSync(frontendDist)) {
  console.error('Error: Frontend dist folder not found at:', frontendDist);
  console.error('Please build the frontend first with: cd frontend && npm run build');
  process.exit(1);
}

// Remove old dist
if (fs.existsSync(backendDist)) {
  fs.rmSync(backendDist, { recursive: true, force: true });
  console.log('Removed old backend/dist');
}

// Copy new build
fs.cpSync(frontendDist, backendDist, { recursive: true });
console.log('✓ Frontend copied to backend/dist successfully');
