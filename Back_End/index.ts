import 'dotenv/config';
import express from 'express';
import { initApp } from './src/app.routes.js';

const app = express();
const port = process.env.PORT || 5000;

initApp(app, express);

app.listen(port, () => {
  console.log(`[Server] Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});
