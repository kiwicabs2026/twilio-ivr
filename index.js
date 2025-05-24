const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const chrono = require('chrono-node');


app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

// 👉 Clean dropoff address
function cleanDropoffAddress(rawDropoff) {
  if (!rawDropoff) return '';

  let cleaned = rawDropoff.toLowerCase();

  const fillerWords = [
    'uhh', 'hmm', 'maybe', 'i think',
  "i'm going to", 'i am going to', 'going to',
  "i'm going", 'i am going', 'going',
  'to', 'just'
  ];

  fillerWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  cleaned = cleaned.replace(/[^\w\s]/gi, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

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
    } else if (lowerDate === 'after tomorrow') {
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        formattedDate = dayAfterTomorrow.toISOString().slice(0, 10).split('-').reverse().join('/');
    } else {
        formattedDate = pickup_date; // Use as-is
    }
}

let formattedTime = pickup_time;

if (pickup_time) {
  const parsedTime = chrono.parseDate(pickup_time);
  if (parsedTime) {
    formattedTime = parsedTime.toLocaleTimeString('en-NZ', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }); // "7:30 AM"
  }
}



 console.log('Booking received (raw):', {
    name,
    address,
    pickup_time: formattedTime,
    pickup_date: formattedDate,
    dropoff,
    caller_number
  });

  console.log('Cleaned dropoff address:', cleanedDropoff);
  console.log('Matched dropoff address:', matchedDropoff);

res.status(200).json({
  success: true,
  message: 'Booking data received and processed.',
  cleaned_dropoff: cleanedDropoff, 
  pickup_date: formattedDate,
  pickup_time: formattedTime       
});


});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
