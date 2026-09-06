const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

require('./db');
const parkingRoutes = require('./routes/parkingRoutes');
const userRoutes = require('./routes/user');
const logger = require('./middleware/logger');
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.get('/', (req, res) => {
    res.send('API Sistem Parkir Gandaria City Mall Berjalan!');
});

app.use('/api/users', userRoutes);

app.use('/api/parking', authenticateToken, parkingRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});