const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const request = require('request');

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

app.prepare().then(() => {
  const server = express();

  server.post('/oauth2', async (req, res) => {
    postRequest({
      url: AHREFS_1,
      headers: {
        ...['Authorization'].reduce((acc, name) => ({
          ...acc,
          [name]: req.headers[name]
        }))
      },
      form: req.form,
    }, (verr, vres, vbody) => {
      res.send(vbody)
    });
  });

  server.get('/', async (req, res) => {
    getRequest({
      url: AHREFS_2,
      qs: req.qs,
    }, (verr, vres, vbody) => {
      res.send(vbody)
    });
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`)
  })
});
