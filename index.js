require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/new-booking', async (req, res) => {
  const booking = req.body;
  console.log('Received booking:', booking);

  const auth = new google.auth.GoogleAuth({
    credentials: require(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const spreadsheetId = '1oig42kp7Kd56dajZ8bsyFrXG9sPJCOHePLZ6WI7SFBQ';

  const sheetName = 'Sheet1';

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        booking.name || '',
        booking.address || '',
        booking.pickup_time || '',
        booking.caller || ''
      ]]
    }
  });

  res.send({ status: 'added to sheet' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
