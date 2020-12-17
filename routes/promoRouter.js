const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router()

promoRouter.use(bodyParser.json());
promoRouter.route('/')

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send all promos to you.`);
  })

  .post((req, res, next) => {
    res.end(`Will add the promo: ${req.body.name} with details: ${req.body.description}`);
  })

  .put((req, res, next) => {
    res.end(`PUT operation not supported on promos`);
  })

  .delete((req, res, next) => {
    res.end('Deleting all promos');
  });

  //:promoId
promoRouter.route('/:promoId')

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send promo ${req.params.promoId} to you.`);
  })

  .post((req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put((req, res, next) => {
    res.write(`Updating promo.....\n`)
    res.end(`Will Update promo ${req.params.promoId}`);
  })

  .delete((req, res, next) => {
    res.end(`Deleting promo ${req.params.promoId}`);
  })

module.exports = promoRouter;