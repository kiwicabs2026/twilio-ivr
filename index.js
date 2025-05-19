const bookings = []; // Memory-only list

app.post('/api/book', async (req, res) => {
  const { name, address, pickup_time, caller_number, dropoff } = req.body;
  const cleanedDropoff = cleanDropoffAddress(dropoff);
  const mappedDropoff = knownLocations[cleanedDropoff] || cleanedDropoff;

  const bookingData = {
    name,
    address,
    pickup_time,
    caller_number,
    dropoff_raw: dropoff,
    dropoff_cleaned: cleanedDropoff,
    dropoff_final: mappedDropoff,
    time_received: new Date().toISOString()
  };

  bookings.push(bookingData); // Store temporarily

  console.log('📞 Booking:', bookingData);

  res.status(200).json({
    success: true,
    message: 'Booking processed.',
    dropoff_cleaned: cleanedDropoff,
    dropoff_final: mappedDropoff
  });
});

// Add a GET endpoint to see all bookings (for testing)
app.get('/bookings', (req, res) => {
  res.json(bookings);
});
