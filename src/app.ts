import express from "express";
import cors from 'cors';
import { errors } from 'celebrate';
import routes from './routes';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

export default app;
