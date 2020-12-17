const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router()

dishRouter.use(bodyParser.json());
dishRouter.route('/') //will mounnt this in the index

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send all dishes to you.`);
  })

  .post((req, res, next) => {
    res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
  })

  .put((req, res, next) => {
    res.end(`PUT operation not supported on /dishes`);
  })

  .delete((req, res, next) => {
    res.end('Deleting all dishes');
  });

// :dishId
dishRouter.route('/:dishId')

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    res.end(`Will send dish ${req.params.dishId} to you.`);
  })

  .post((req, res, next) => {
    res.end(`Post ops. not supported`);
  })

  .put((req, res, next) => {
    res.write(`Updating dish.....\n`)
    res.end(`Will Update dish ${req.params.dishId}`);
  })

  .delete((req, res, next) => {
    res.end(`Deleting dish ${req.params.dishId}`);
  })

module.exports = dishRouter;