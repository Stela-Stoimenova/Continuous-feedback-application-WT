require('dotenv').config();
const path = require('path');

console.log('backend cwd:', process.cwd());
console.log('.env path (resolved):', path.resolve(__dirname, '.env'));
console.log('DB_PASS raw:', JSON.stringify(process.env.DB_PASS));
console.log('type(process.env.DB_PASS):', typeof process.env.DB_PASS);

const cfg = require('./config/config.js');
console.log('config.development.password (raw):', JSON.stringify(cfg.development.password));
console.log('type(config.development.password):', typeof cfg.development.password);