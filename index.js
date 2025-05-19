const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Twilio IVR backend is running.');
});

function cleanDropoffAddress(rawDropoff) {
  if (!rawDropoff) return '';

  // Lowercase for consistent processing
  let cleaned = rawDropoff.toLowerCase();

  // Remove filler words
  const fillerWords = ['uhh', 'hmm', 'maybe', 'i think', 'to', 'i\'m going to', 'going to', 'just'];
  fillerWords.forEach(word => {
    cleaned = cleaned.replace(word, '');
  });

  // Capitalize first letters (optional)
  cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());

  // Trim extra spaces
  cleaned = cleaned.trim();

  return cleaned;
}

app.post('/api/book', async (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;

  const cleanedDropoff = cleanDropoffAddress(dropoff);

  console.log('Booking received (raw):', { name, address, pickup_time, dropoff, caller_number });
  console.log('Cleaned dropoff address:', cleanedDropoff);

  // Here you could also store, forward, or validate the cleaned address

  res.status(200).json({
    success: true,
    message: 'Booking data received and processed.',
    cleaned_dropoff: cleanedDropoff
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
