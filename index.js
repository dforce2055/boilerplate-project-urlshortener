require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

const DB = require('./src/database.js')
const ShortURL = require('./src/models/ShortURL.js')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async function(req, res) {
  try {
    const { url } = req.body

    if (!validURL(url))
      throw new Error('invalid url')

    const { original_url, short_url } = await createAndSaveURL(url)
    res.json({
      original_url: url,
      short_url
    });
  } catch (error) {
    res.json({
      error: 'invalid url'
    });
  }
})

app.get('/api/shorturl/:number?', async function(req, res) {
  try {
    const { number } = req.params

    if (!validNumber(number))
      throw new Error('invalid url number')

    const { original_url, short_url } = await getShortURLByNumber(number)

    if (!original_url)
      throw new Error('url not found')
    
    res.redirect(original_url)
  } catch (error) {
    res.json({
      error: 'invalid url'
    })
  }
})

const validURL = (urlParam) => {
  try {
    const result = new URL(urlParam)
    if (!result) 
      return false

    return result.protocol === 'https:' ? true : false
  } catch (error) {
    return false
  }
}
const validNumber = (number) => {
  try {
    return Boolean(parseInt(number))
  } catch (error) {
    return false
  }
}

const createAndSaveURL = async (URLParam) => {
  try {
    const newURL = new ShortURL({
      original_url: URLParam,
      short_url: new Date().getTime() // increment number
    });

    return await newURL.save()
  } catch (error) {
    throw error
  }
}
const getShortURLByNumber = async (URLNumber) => {
  try {
    const result = await ShortURL.findOne({ short_url: URLNumber })
    return result
  } catch (error) {
    throw error
  }
};


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
