const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Optional: Root route to handle GET /
app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

// Handle POST booking data from Twilio
app.post('/api/book', async (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;

  console.log('Booking received:', {
    name,
    address,
    pickup_time,
    dropoff,
    caller_number,
  });

  res.status(200).json({ success: true, message: 'Booking data received.' });
});

// Fallback for any other route
app.use((req, res) => {
  console.log('Unhandled request:', req.method, req.originalUrl);
  res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
