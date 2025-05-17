{
  "name": "{{widgets.GetCallerName.SpeechResult}}",
  "pickup_address": "{{widgets.GetPickupAddress.SpeechResult}}",
  "pickup_time": "now",
  "caller_number": "{{contact.channel.address}}"
}


“Thank you. We have your name as {{widgets.GetCallerName.SpeechResult}}, pickup address as {{widgets.GetPickupAddress.SpeechResult}}, If this is correct, please stay on the line.”


const express = require('express');
const app = express();

// Use port from environment variable, fallback to 3000 for local dev
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Root route - quick check if server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// POST /api/book - receive booking data from Twilio Studio
app.post('/api/book', (req, res) => {
  const { name, address, pickup_time, caller_number } = req.body;

  console.log('Booking received:');
  console.log('Name:', name);
  console.log('Address:', address);
  console.log('Pickup time:', pickup_time);
  console.log('Caller number:', caller_number);

  // TODO: Forward data to TaxiCaller or save to DB here

  // Respond back to Twilio to confirm receipt
  res.status(200).json({ success: true, message: 'Booking received' });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});





# Node.js dependencies
node_modules/

# Environment variables (keep Twilio tokens, API keys, etc. here)
.env

# Log files
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Optional: editor/project settings
.DS_Store
.vscode/
.idea/

# Build artifacts (if used)
dist/
build/




