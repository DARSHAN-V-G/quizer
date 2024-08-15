const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`));

