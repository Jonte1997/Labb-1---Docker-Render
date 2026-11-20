import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const title = process.env.APP_TITLE || 'Workout Tracker';
const folder = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.get('/health', (req, res) => {
  console.info('Health check anropades');
  res.json({ status: 'ok' });
});

app.get('/api/config', (req, res) => {
  res.json({ title });
});

app.post('/api/log-error', (req, res) => {
  console.error('Demonstration av ett kontrollerat fel');
  res.status(400).json({ error: 'Detta är ett demonstrationsfel.' });
});

app.use(express.static(path.join(folder, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(folder, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.info(`Servern körs på port ${port}`);
});
