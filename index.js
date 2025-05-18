const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

app.post('/api/book', async (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;

  console.log('Booking received:', {
    name,
    address,
    pickup_time,
    dropoff, // ✅ Log the dropoff field
    caller_number,
  });

  res.status(200).json({ success: true, message: 'Booking data received.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
