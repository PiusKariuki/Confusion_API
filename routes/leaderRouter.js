const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = require('./promoRouter');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send all leaders to you.`);
  })

  .post((req, res, next) => {
    res.end(`Will add the leader: ${req.body.name} with details: ${req.body.description}`);
  })

  .put((req, res, next) => {
    res.end(`PUT operation not supported on leaders`);
  })

  .delete((req, res, next) => {
    res.end('Deleting all leaders');
  });

leaderRouter.route('/:leaderId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send leader ${req.params.leaderId} to you.`);
  })

  .post((req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put((req, res, next) => {
    res.write(`Updating leader.....\n`)
    res.end(`Will Update leader ${req.params.leaderId}`);
  })

  .delete((req, res, next) => {
    res.end(`Deleting leader ${req.params.leaderId}`);
  })

module.exports = leaderRouter;