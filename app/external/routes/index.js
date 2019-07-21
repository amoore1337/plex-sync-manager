const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();

module.exports = (app) => {
  app.get('/ping', (_, res) => { res.send('pong'); });

  Object.keys(routes).forEach((routeName) => {
    const router = express.Router();
    require('./' + routeName)(router);

    app.use('/api/' + changeCase.paramCase(routeName), router);
  });
};
