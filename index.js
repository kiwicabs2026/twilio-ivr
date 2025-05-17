const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Taxi IVR backend is running.');
});

// POST /api/book - receive booking data from Twilio Studio
app.post('/api/book', (req, res) => {
  const { name, address, pickup_time, caller_number } = req.body;

  if (!name || !address || !pickup_time || !caller_number) {
    return res.status(400).json({ success: false, message: 'Missing booking fields' });
  }

  console.log('✅ Booking received:');
  console.log('Name:', name);
  console.log('Address:', address);
  console.log('Pickup time:', pickup_time);
  console.log('Caller number:', caller_number);

  // TODO: Forward data to TaxiCaller API or store in database

  res.status(200).json({ success: true, message: 'Booking received' });
});

// POST /api/cancel - receive cancellation request from Twilio Studio
app.post('/api/cancel', (req, res) => {
  const { caller_number } = req.body;

  if (!caller_number) {
    return res.status(400).json({ success: false, message: 'Missing caller_number' });
  }

  console.log(`🚫 Cancellation request received for caller: ${caller_number}`);

  // TODO: Cancel booking in TaxiCaller API or remove from DB

  res.status(200).json({ success: true, message: `Booking for ${caller_number} has been canceled.` });
});

// POST /api/update-time - change pickup time for existing booking
app.post('/api/update-time', (req, res) => {
  const { caller_number, new_pickup_time } = req.body;

  if (!caller_number || !new_pickup_time) {
    return res.status(400).json({ success: false, message: 'Missing caller_number or new_pickup_time' });
  }

  console.log(`🔁 Update request for ${caller_number}: New pickup time - ${new_pickup_time}`);

  // TODO: Update the booking in your system (e.g., TaxiCaller or database)

  res.status(200).json({ success: true, message: `Pickup time updated for ${caller_number}` });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
