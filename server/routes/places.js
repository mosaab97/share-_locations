const express = require('express');
const { check } = require("express-validator");

const { getPlaceById, getPlacesByUserId, addNewPlace, deletePlace, updatePlace } = require('../controllers/places');

const router = express.Router();

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.post('/', 
  [
    check('title')
    .not()
    .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
    check('creator').not().isEmpty()
  ], 
  addNewPlace);

router.patch('/:pid',
  [
    check('title')
    .not()
    .isEmpty(),
    check('description').isLength({ min: 5 })
  ], updatePlace);

router.delete('/:pid', deletePlace);

module.exports = router;