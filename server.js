const express = require('express');
const cors = require('cors');
const compression = require('compression');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const requestTimeout = 240 * 1000;

const getRequest = request.defaults({
  method: 'GET',
  gzip: true,
  timeout: requestTimeout,
  // strictSSL: true,
  json: true,
});

const postRequest = request.defaults({
  method: 'POST',
  gzip: true,
  timeout: requestTimeout,
  // strictSSL: true,
  json: true,
});

const AHREFS_1 = 'https://ahrefs.com/oauth2/token.php';
const AHREFS_2 = 'https://apiv2.ahrefs.com';

app.post('/oauth2', async (req, res) => {
  postRequest({
    url: AHREFS_1,
    headers: {
      ...['Authorization'].reduce((acc, name) => ({
        ...acc,
        [name]: req.headers[name]
      }))
    },
    form: req.body,
  }, (verr, vres, vbody) => {
    res.send(vbody)
  });
});

app.get('/', async (req, res) => {
  getRequest({
    url: AHREFS_2,
    qs: req.qs,
  }, (verr, vres, vbody) => {
    res.send(vbody)
  });
});

// run server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`:${port}`));
