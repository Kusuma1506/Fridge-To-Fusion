import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes.js';

const app = express();
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '20kb' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api', recipeRoutes);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong. Please try again.' });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`API listening on port ${port}`));
