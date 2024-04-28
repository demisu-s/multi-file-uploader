import express from 'express';
import appRouter from './routes/routes';
import cors from 'cors';

const PORT = 3003;

const app = express();

app.use(express.json());
app.use(cors()); // You need to call cors as a function

app.use('/api/files', appRouter);

app.listen(PORT, () => {
    console.log("Server Started at 3003");
});
