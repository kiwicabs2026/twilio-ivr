// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging helper
function logBookingAction(action, data) {
  console.log(`\n📞 [${action.toUpperCase()}]`);
  console.log('Name:', data.name || 'N/A');
  console.log('Pickup Address:', data.pickup_address || 'N/A');
  console.log('Pickup Time:', data.pickup_time || 'N/A');
  console.log('Caller Number:', data.caller_number || 'N/A');
}

// Main callback route
app.post('/twilio-callback', (req, res) => {
  const data = req.body;

  // Determine action (booking, change, cancel)
  let action = 'booking';
  if (data.action === 'cancel') action = 'cancel';
  else if (data.action === 'change') action = 'change';
  else if (data.action === 'connect') action = 'connect_to_staff';

  // Log to Render
  logBookingAction(action, data);

  // Send basic response
  res.status(200).json({ status: 'ok', message: `Received ${action} request.` });
});

// Root route
app.get('/', (req, res) => {
  res.send('🚖 Twilio IVR Booking Server is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
