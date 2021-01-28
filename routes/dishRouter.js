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

// copy
dishRouter.route('/:dishId/comments') //mount in index

  .get((req, res, next) => {
    //  use find method from mongoose
    Dishes.findById(req.params.dishId) //returns promise
      .then(dish => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments);
        }

        else {
          err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err); //handled by app.js
        }


      }, err => next(err))
      .catch(err => next(err));

  })

  .post((req, res, next) => {
    Dishes.findById(req.params.dishId) //return promise
      .then(dish => {
        if (dish != null) {
          dish.comments.push(req.body);
          dish.save()  //returns promise
            .then(dish => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            })

        }
        else {
          err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
      }, err => next(err))
      .catch(err => next(err));
  })

  .put((req, res, next) => {
    res.end(`PUT operation not supported on /dishes ${req.params.dishId} /comments`);
  })

  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)

      .then(dish => {
        if (dish != null) {
          for (let i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
          }

          dish.save()

            .then(dish => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish)
            }, err => next(err))
            .catch(err => next(err));

        }

        else {
          err = new Error(`Dish id: ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }

      }, err => next(err))
      .catch(err => next(err));

  });

// /:comment
dishRouter.route('/:dishId/comments/:commentId')

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)

      .then(dish => {

        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
          err = new error(`Dish id: ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        else {
          err = new Error(`Comment id: ${req.params.commentId} not found`);
          err.status = 404;
          return next(err)
        }

      }, err => next(err))
      .catch(err => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`Post ops. not supported on /dishes/:${req.params.dishId}/comments/:${req.params.commentId}`);
  })

  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    then(dish => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        dish.save()
          .then(dish => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          }, err => next(err))
          .catch(err => next(err))
      }

      else {
        err = new Error(`Dish id:${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      }

    }, err => next(err))
      .catch(err => next(err));

  })

  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {

        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          dish.comments.id(req.params.commentId).remove();
          dish.save()
            .then(dish => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            }, err => next(err))
            .catch(err => next(err));
        }

        else if (dish == null) {
          err = new Error(`Dish id:${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }

        else {
          err = new Error(`Comment id:${req.params.commentId} not found`)
        }

      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = dishRouter;