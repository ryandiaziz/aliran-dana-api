import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes/index.js';
import client from './configs/database-config.js';
import { config } from './configs/dotenv-config.js';

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', Routes);

app.get('/', (req, res) => {
    res.json({
        info: 'Welcome'
    })
})

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});

client.connect(err => {
    if (!err) {
        console.log('Database connect')
    } else {
        console.log(err.message)
    }
})