import express from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import eventRoutes from './routes/eventRoutes';
import participantRoutes from './routes/participantRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' folder

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/users', userRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
