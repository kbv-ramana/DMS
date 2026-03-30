const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Serve uploaded files */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ✅ MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

/* ✅ Routes */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/documents', documentRoutes);

/* ✅ Test Route */
app.get('/', (req, res) => {
  res.send('DMS Backend Running');
});

/* ✅ Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});