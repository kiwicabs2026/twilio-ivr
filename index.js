const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

// 👉 Clean dropoff address
function cleanDropoffAddress(rawDropoff) {
  if (!rawDropoff) return '';

  let cleaned = rawDropoff.toLowerCase();

  // Remove common filler words and phrases
  const fillerWords = [
    'uhh', 'hmm', 'maybe', 'i think',
    "i'm going to", 'i am going to', 'going to', 'to', 'just'
  ];

  fillerWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Remove punctuation and trim extra spaces
  cleaned = cleaned.replace(/[^\w\s]/gi, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Capitalize first letters (optional)
  cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());

  return cleaned;
}

// 👉 Match cleaned dropoff to known full address
function matchKnownPlace(cleaned) {
  const knownPlaces = {
    'airport': 'Wellington Airport',
    'railway station': 'Wellington Railway Station',
    'hospital': 'Wellington Hospital',
    'vic university': 'Victoria University',
    'cbd': 'Wellington CBD'
  };

  const lower = cleaned.toLowerCase();
  for (const key in knownPlaces) {
    if (lower.includes(key)) {
      return knownPlaces[key];
    }
  }

  return cleaned;
}

// 👉 Main booking route
app.post('/api/book', async (req, res) => {
  let { name, address, pickup_time, pickup_date, caller_number, dropoff } = req.body;

  const cleanedDropoff = cleanDropoffAddress(dropoff);
  const matchedDropoff = matchKnownPlace(cleanedDropoff);
// Normalize the pickup_date to NZ format
const today = new Date();
let formattedDate = '';

if (pickup_date) {
  const lowerDate = String(pickup_date).toLowerCase().trim();
if (lowerDate === 'today') {
  formattedDate = today.toISOString().slice(0, 10).split('-').reverse().join('/');
} else if (lowerDate === 'tomorrow') {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  formattedDate = tomorrow.toISOString().slice(0, 10).split('-').reverse().join('/');
} else {
  formattedDate = pickup_date; // Use as-is
}

 console.log('Booking received (raw):', {
    name,
    address,
    pickup_time,
    pickup_date: formattedDate,
    dropoff,
    caller_number
  });

  console.log('Cleaned dropoff address:', cleanedDropoff);
  console.log('Matched dropoff address:', matchedDropoff);

  res.status(200).json({
    success: true,
    message: 'Booking data received and processed.',
    cleaned_dropoff: matchedDropoff,
    pickup_date: formattedDate
  });


});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
