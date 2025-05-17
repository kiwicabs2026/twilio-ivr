const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Logging middleware (to track all requests)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Helper function to log data to Render
function logToRender(dataType, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: dataType,
    ...data,
  };
  console.log(JSON.stringify(logEntry)); // Appears in Render logs
}

// Booking handler
app.post('/booking', (req, res) => {
  const { callerName, pickupAddress, pickupTime, callerNumber } = req.body;

  if (!callerName || !pickupAddress || !pickupTime || !callerNumber) {
    return res.status(400).send({ error: 'Missing booking fields.' });
  }

  // Log data
  logToRender('Booking', {
    callerName,
    pickupAddress,
    pickupTime,
    callerNumber,
  });

  // Respond back
  res.status(200).json({ success: true, message: 'Booking received' });
});

// Cancel handler
app.post('/cancel', (req, res) => {
  const { callerNumber } = req.body;

  if (!callerNumber) {
    return res.status(400).send({ error: 'Missing caller number.' });
  }

  logToRender('Cancel Booking', { callerNumber });

  return res.status(200).send({ message: 'Booking cancelled.' });
});

// Change time handler
app.post('/change-time', (req, res) => {
  const { callerNumber, newPickupTime } = req.body;

  if (!callerNumber || !newPickupTime) {
    return res.status(400).send({ error: 'Missing fields.' });
  }

  logToRender('Change Pickup Time', { callerNumber, newPickupTime });

  return res.status(200).send({ message: 'Pickup time updated.' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Taxi IVR API is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
