import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Path to the built frontend
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// API endpoint to get sweets directly from file (for persistence on Render temp disk)
app.get('/sweets.json', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'sweets.json'));
});

app.get('/bills.json', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'bills.json'));
});

// Endpoint to save sweets
app.post('/api/save-sweets', (req, res) => {
  const filePath = path.join(PUBLIC_DIR, 'sweets.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    console.log('Sweets data saved to sweets.json');
    res.json({ success: true, message: 'Sweets saved successfully' });
  } catch (error) {
    console.error('Error saving sweets:', error);
    res.status(500).json({ success: false, message: 'Error saving sweets' });
  }
});

// Endpoint to save bills
app.post('/api/save-bills', (req, res) => {
  const filePath = path.join(PUBLIC_DIR, 'bills.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    console.log('Bills data saved to bills.json');
    res.json({ success: true, message: 'Bills saved successfully' });
  } catch (error) {
    console.error('Error saving bills:', error);
    res.status(500).json({ success: false, message: 'Error saving bills' });
  }
});

// Serve frontend static files from dist
app.use(express.static(DIST_DIR));

// Handle React Router - server index.html for any other routes
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
