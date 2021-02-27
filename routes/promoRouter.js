const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

// loading models
const Promos = require('../models/promotions');
// mounting router to index
const promoRouter = express.Router()

promoRouter.use(bodyParser.json());
promoRouter.route('/')

  .get((req, res, next) => {
    Promos.find({})
    .then(promo =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    }, err => next(err))
    .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    Promos.create(req.body)
    .then(promo =>{
      console.log('promo created');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    }, err =>next(err))
    .catch(err => next(err));
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.end(`PUT operation not supported on promos`);
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Promos.deleteMany({})
    .then(resp =>{
      console.log('Dishes deleted');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, err => next(err))
    .catch(err => next(err));
  });

  //:promoId
promoRouter.route('/:promoId')

  .get((req, res, next) => {
    Promos.findById(req.params.promoId)
    .then(promo =>{
      res.statusCode= 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    }, err => next(err))
    .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new: true})
    .then(promo =>{
      console.log('Promo updated');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    }, err => next(err))
    .catch(err =>next(err));
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
   Promos.findByIdAndRemove(req.params.promoId)
   .then(resp =>{
     console.log(`Promo with id: ${req.params.promoId} was removed`);
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(resp);
   }, err => next(err))
   .catch(err => next(err))
  });

module.exports = promoRouter;