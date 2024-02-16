// NPM modules
let express = require('express');

let app = express();
let port = process.env.PORT || 8000;

app.use(express.text({ type: 'text/plain' }));
// app.use(express.json());

// Route handler for POST requests
app.post('/api', (req, res) => {
  // Check Content-Type header
  // if (req.get('Content-Type') !== 'text/plain') {
  //   return res.status(400).send('Content-Type must be text/plain');
  // }

  // // Check encoding
  // if (req.charset !== 'utf-8') {
  //   return res.status(400).send('Request must be in UTF-8 encoding');
  // }
  console.log('Incoming payload:');
  console.log(req.body);
  let parsed = JSON.parse(req.body);
  console.log('Parsed: ');
  console.log(parsed);
  let response = generateResponseBody(parsed);

  // Mock response
  res.status(200).send(response);
});

function generateResponseBody(req_body) {
  let number_fields = ['temperature', 'error_code'].join();
  let mock_observed_values = [];
  console.log(req_body);
  let fields = req_body.fields.split(',');

  for (let field of fields) {
    number_fields.includes(field)
      ? (mock_observed_values[field] = getRandomNumber(1, 200))
      : (mock_observed_values[field] = getTrueOrFalse());
  }
  // console.log(mock_observed_values);

  const response_body = {
    _maCn: 'FindResponse',
    serverVersion: {
      major: 2,
      minor: 8,
      patch: 1,
      preRelease: 'alpha',
    },
    sync: {
      revision: 0,
      needToSync: false,
      dateLastUpdated: 1560885219000,
    },
    objects: [
      {
        className: 'Account',
        id: req_body.filters[0].fullText,
        ...mock_observed_values,
        strUniqueKey: '102995',
        new: false,
        dirty: false,
        uideleted: false,
      },
    ],
    totalObjects: 1,
  };

  console.log(`\nResponse body: ${response_body}`);
  return response_body;
}

// Random data value helper functions

// Random number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // Return a random integer if decimalPlaces is 0 or negative
}

// 50/50 T/F
function getTrueOrFalse() {
  return Math.floor(Math.random() * 2) == 1 ? true : false;
}

// Start server - listen for client connections
app.listen(port, () => {
  console.log('Now listening on port ' + port);
});
