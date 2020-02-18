import { config } from 'dotenv';
config();
import { json } from 'body-parser';
import express from 'express';
import Operations from './operations';
import Logger from './logger';

const app = express(),
    operations = new Operations();

// Apply parser for every incoming request
app.use(json());

// Endpoint for conversation init by bot (from scheduler)
app.post('/conv/init/bot', async (req, res) => {
    const users = await operations.handleBotInit();
    res.status(200).json(users);
});

// Endpoint for performing update instance action
app.post('/perform/updateUserInstances', async (req, res) => {
    const success = await operations.updateUserInstances(req.body);
    return res.status(success ? 200 : 500).send({ success });
});

app.post('/perform/generateCard', (req, res) => {
    const cardJsonStr = operations.generateCard(req.body.data.watsonContext.instances);
    res.json(JSON.parse(cardJsonStr)).status(200).send();
});

// Listen to connections on the specified port
app.listen(process.env.PORT, () => {
    Logger.info(`app is running on port ${process.env.PORT}`);
});
