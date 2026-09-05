require('dotenv').config();
const express = require('express');
const path = require('path');

const intakeRoute = require('./routes/intake');
const followupRoute = require('./routes/followup');
const statsRoute = require('./routes/stats');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/intake', intakeRoute);
app.use('/api/followup-check', followupRoute);
app.use('/api/stats', statsRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
