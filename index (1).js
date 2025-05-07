const express = require('express');
const { google } = require('googleapis');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: 'your-project-id',
    private_key_id: 'your-private-key-id',
    private_key: '-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY\n-----END PRIVATE KEY-----\n',
    client_email: 'your-service-account-email@your-project-id.iam.gserviceaccount.com',
    client_id: 'your-client-id',
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'Sheet1';  // Update if your sheet name is different

app.post('/new-booking', async (req, res) => {
  const { address, pickup_time, caller } = req.body;
  const timestamp = new Date().toLocaleString();

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, '', address, pickup_time, caller]],
      },
    });
    res.send({ status: 'Booking saved' });
  } catch (err) {
    console.error('Error appending to sheet:', err);
    res.status(500).send({ error: 'Failed to save booking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});