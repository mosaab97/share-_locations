const HttpError = require("../models/httpError");
const { validationResult } = require('express-validator');
const getCoordsForAddress = require("../Util/location");
const Place = require("../models/Place");
const User = require('../models/user');
const { default: mongoose } = require("mongoose");


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    }
    if (!place) {
        return next(new HttpError('Place not found.', 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    }
    if (places.length === 0) {
        return next(new HttpError('No places found for this user.', 404));
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const addNewPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { title, description, address, creator } = req.body;

    let coords;
    try {
        coords = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const newPlace = Place({
        title,
        description,
        address,
        location: coords,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch(err) {
        return next(new HttpError("Creating place failed, please try again", 500))
    }

    if(!user) {
        return next(new HttpError("User not exist, please try again", 404))
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save(({ session: sess }));
        user.places.push(newPlace); //spectial push from mongoose
        await user.save();
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError('Creating place failed, please try again.', 500);
        return next(error);
    }
    
    res.status(201).json({ place: newPlace });
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const placeId = req.params.pid;
    const { title, description } = req.body;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Something went wrong, could not update place.', 500));
    }
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        return next(new HttpError('Something went wrong, could not update place.', 500));
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    if (!place) {
        return next(new HttpError('Place not found.', 404));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess});
        place.creator.places.pull(place);
        await place.creator.save({ session: sess});
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    res.status(200).json({ message: 'Place deleted.' });
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    addNewPlace,
    updatePlace,
    deletePlace
};