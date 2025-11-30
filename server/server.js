const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs')
const https = require('https');
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://3.108.254.144'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const postRoutes = require('./routes/postRoutes');
const adminSearchRoutes = require('./routes/adminSearchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);
app.use('/posts', postRoutes);
app.use('/admins', adminSearchRoutes);
app.use('/category', categoryRoutes);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
const options = {
  key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
};

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
