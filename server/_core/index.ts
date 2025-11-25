import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Serve the static files from the client/dist directory
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

// Handles any requests that don't match the ones above
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
