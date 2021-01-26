const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//load the models
const Dishes = require('../models/dishes');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/') //will mounnt this in the index

  .get((req, res, next) => {
    //  use find method from mongoose
    Dishes.find({}) //returns promise
      .then(dishes => {   //returns an array of dishes
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes); //sending json response to client
      }, err => next(err))
      .catch(err => next(err)); //passes err to app.js

  })

  .post((req, res, next) => {
    Dishes.create(req.body) //return promise
      .then(dish => {
        console.log('Dish created');
        res.statusCode = 200;
        res.setHeader('Content_Type', 'application/json');
        res.json(dish)
      }, err => next(err))
      .catch(err => next(err));
  })

  .put((req, res, next) => {
    res.end(`PUT operation not supported on /dishes`);
  })

  .delete((req, res, next) => {
    Dishes.deleteMany({})  //returns promise remove({})
      .then(resp => {
        console.log(`dishes deleted`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, err => next(err))
      .catch(err => next(err));
  });

// :dishId
dishRouter.route('/:dishId')

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        console.log(`Dish found`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })

  .post((req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body   //update the selected dish
    }, { new: true })    //find returns updated dish
      .then(dish => {
        console.log('Dish updated');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, err => next(err))
      .catch(err => next(err));
  })

  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(resp => {
        console.log(`dish with id ${req.params.dishid} was deleted`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err));
  })

module.exports = dishRouter;