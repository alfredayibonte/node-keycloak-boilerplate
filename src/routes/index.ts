import HomeControllers from 'controllers/HomeControllers';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', HomeControllers.index)


export default app;