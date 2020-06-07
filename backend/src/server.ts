import express, { response } from 'express';
import path from 'path'
import routes from './routes';
import cors from 'cors';

import settings from './settings'

const app = express();

// CORS
app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.listen(settings.server_port);