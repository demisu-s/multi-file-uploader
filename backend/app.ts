import express from 'express';
import appRouter from './routes/routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const port=process.env.PORT || 3003;

const app = express();
 
app.use(express.json());
app.use(cors()); // You need to call cors as a function

app.use('/api/files', appRouter);

app.listen(port, () => { 
    console.log(`Server Started at ${port}`);
});
