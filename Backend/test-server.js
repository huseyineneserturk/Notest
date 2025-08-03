require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3001;

console.log('🔧 Starting minimal test server...');
console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  PORT: PORT
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test server works!' });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});