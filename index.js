const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/new-booking', (req, res) => {
  const booking = req.body;
  console.log('Received booking:', booking);
  res.send({ status: 'received' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});