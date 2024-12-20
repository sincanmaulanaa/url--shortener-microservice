const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let urlDatabase = [];
let idCounter = 1;

function isValidUrl(userInput) {
  const urlPattern = new RegExp('^(http|https)://[^ "]+$');
  return urlPattern.test(userInput);
}

app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = idCounter++;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find((entry) => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
