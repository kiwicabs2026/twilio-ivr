const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: in-memory booking store (just for demo)
const bookings = {};

// Root route
app.get('/', (req, res) => {
  res.send('🚖 Twilio IVR backend is live.');
});

// ✅ 1. New Booking: POST /twilio-callback
app.post('/twilio-callback', (req, res) => {
  const { name, address, caller_number } = req.body;

  if (!name || !address || !caller_number) {
    console.warn('Missing data in booking request:', req.body);
    return res.status(400).send('Missing one or more required fields.');
  }

  // Save or simulate booking
  bookings[caller_number] = { name, address };
  console.log(`✅ New booking from ${caller_number}:`, bookings[caller_number]);

  // TODO: Forward to TaxiCaller API here if needed

  res.status(200).send('Booking received.');
});

// ✅ 2. Cancel Booking: POST /cancel-booking
app.post('/cancel-booking', (req, res) => {
  const { caller_number } = req.body;

  if (!caller_number) {
    return res.status(400).send('Missing caller number.');
  }

  if (!bookings[caller_number]) {
    return res.status(404).send('No booking found for this number.');
  }

  delete bookings[caller_number];
  console.log(`❌ Booking cancelled for ${caller_number}`);

  res.status(200).send('Booking cancelled.');
});

// ✅ 3. Connect to Staff: POST /connect-staff
app.post('/connect-staff', (req, res) => {
  const { caller_number } = req.body;

  if (!caller_number) {
    return res.status(400).send('Missing caller number.');
  }

  console.log(`📞 Connect request from ${caller_number} to staff`);

  // Respond back to Twilio Studio to dial staff
  const twimlResponse = `
    <Response>
      <Dial>+1234567890</Dial> <!-- Replace with your real staff number -->
    </Response>
  `;

  res.set('Content-Type', 'text/xml');
  res.send(twimlResponse.trim());
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
