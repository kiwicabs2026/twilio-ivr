const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory store for bookings (temporary; resets on redeploy)
const bookings = [];

// Optional known locations mapping
const knownLocations = {
  'Wellington Hospital': 'Wellington Hospital, Riddiford St, Newtown, Wellington 6021',
  // Add more known drop-off mappings if needed
};

// Function to clean dropoff speech
function cleanDropoffAddress(rawDropoff) {
  if (!rawDropoff) return '';

  let cleaned = rawDropoff.toLowerCase();

  // Longer phrases first
  const fillerPhrases = [
    "i'm going to", "i am going to", "going to", "i'm going",
    "uhh", "hmm", "maybe", "i think", "to", "just"
  ];

  fillerPhrases.forEach(phrase => {
    cleaned = cleaned.replaceAll(phrase, '');
  });

  // Capitalize each word
  cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());

  // Remove extra spaces
  cleaned = cleaned.trim().replace(/\s+/g, ' ');

  return cleaned;
}

// Health check route
app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

// View bookings (temporary viewer)
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

// Handle incoming bookings
app.post('/api/book', (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;

  const cleanedDropoff = cleanDropoffAddress(dropoff);
  const mappedDropoff = knownLocations[cleanedDropoff] || cleanedDropoff;

  const booking = {
    name,
    address,
    pickup_time,
    caller_number,
    dropoff_raw: dropoff,
    dropoff_cleaned: cleanedDropoff,
    dropoff_final: mappedDropoff,
    received_at: new Date().toISOString()
  };

  bookings.push(booking);

  console.log('📞 Booking received:', booking);

  res.status(200).json({
    success: true,
    message: '
