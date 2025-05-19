const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

// 🧠 List of known drop-off phrases and full addresses
const knownPlaces = {
  'wellington hospital': 'Wellington Hospital, South Rd, London NW8 9LE',
  'heathrow': 'Heathrow Airport, Longford TW6, UK',
  'paddington station': 'Paddington Station, Praed St, London W2 1RH'
};

// 🧼 Function to clean up raw speech input
function cleanDropoffAddress(rawDropoff) {
  if (!rawDropoff) return '';

  let cleaned = rawDropoff.toLowerCase();

  // Remove filler phrases
  const fillerWords = [
    'uhh', 'hmm', 'maybe', 'i think', 'to',
    "i'm going to", "i am going to", 'going to', 'just'
  ];

  fillerWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of each word (optional)
  cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());

  return cleaned;
}

// 🔍 Try to match cleaned input to a known place
function matchKnownPlace(cleaned) {
  const lowercase = cleaned.toLowerCase();
  for (const key in knownPlaces) {
    if (lowercase.includes(key)) {
      return knownPlaces[key];
    }
  }
  return cleaned;
}

// 📦 Handle booking data
app.post('/api/book', async (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;

  // Clean and match dropoff
  const cleanedDropoff = cleanDropoffAddress(dropoff);
  const matchedDropoff = matchKnownPlace(cleanedDropoff);

  console.log('Booking received (raw):', {
    name,
    address,
    pickup_time,
    dropoff,
    caller_number
  });

  console.log('Cleaned dropoff address:', cleanedDropoff);
  console.log('Matched dropoff address:', matchedDropoff);

  // ✅ You can now forward this to your dispatch system if needed

  res.status(200).json({
    success: true,
    message: 'Booking data received and processed.',
    cleaned_dropoff: matchedDropoff
  });
});

// 🚀 Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
