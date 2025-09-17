const express = require('express');
const { check } = require("express-validator");
const auth = require('../middleware/auth');

const { getPlaceById, getPlacesByUserId, addNewPlace, deletePlace, updatePlace } = require('../controllers/places');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.use(auth);

router.post('/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
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