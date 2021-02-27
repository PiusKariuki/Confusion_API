const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

// bring in the model
const Leaders = require('../models/leaders');

// mounting router
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

  .get((req, res, next) => {
    Leaders.find({})
    .then(leader =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, err => next(err))
    .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then(leader =>{
      console.log('leader created');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, err =>next(err))
    .catch(err => next(err));
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.end(`PUT operation not supported on leaders`);
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteMany({})
    .then(resp =>{
      console.log('All Leaders deleted');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, err => next(err))
    .catch(err => next(err));
  });

  //:leaderId
leaderRouter.route('/:leaderId')

  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then(leader =>{
      res.statusCode= 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, err => next(err))
    .catch(err => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then(leader =>{
      console.log('Leader updated');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, err => next(err))
    .catch(err =>next(err));
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
   Leaders.findByIdAndRemove(req.params.leaderId)
   .then(resp =>{
     console.log(`Leader with id: ${req.params.leaderId} was removed`);
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(resp);
   }, err => next(err))
   .catch(err => next(err))
  });


module.exports = leaderRouter;