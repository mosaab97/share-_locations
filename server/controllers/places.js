const HttpError = require("../models/httpError");
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require("../Util/location");

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'Famous skyscraper in New York City',
        location: { lat: 40.7484405, lng: -73.9878584 },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Eiffel Tower',
        description: 'Iconic tower in Paris',
        location: { lat: 48.8583701, lng: 2.2922926 },
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        creator: 'u2'
    },
    {
        id: 'p3',
        title: 'Colosseum',
        description: 'Ancient amphitheater in Rome',
        location: { lat: 41.8902102, lng: 12.4922309 },
        address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
        creator: 'u1'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);
    if (!place) {
        return next(new HttpError('Place not found.', 404));
    }
    res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);
    if (places.length === 0) {
        return next(new HttpError('No places found for this user.', 404));
    }
    res.json({ places });
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
    const newPlace = {
        id: uuidv4(),
        title,
        description,
        location: coords, // Placeholder for actual geocoding
        address,
        creator
    };
    DUMMY_PLACES.push(newPlace);
    res.status(201).json({ place: newPlace });
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const placeId = req.params.pid;
    const { title, description } = req.body;
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    if (placeIndex === -1) {
        return next(new HttpError('Place not found.', 404));
    }
    DUMMY_PLACES[placeIndex] = {
        ...DUMMY_PLACES[placeIndex],
        title: title || DUMMY_PLACES[placeIndex].title,
        description: description || DUMMY_PLACES[placeIndex].description
    };
    res.json({ place: DUMMY_PLACES[placeIndex] });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    // DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    if (placeIndex === -1) {
        return next(new HttpError('Place not found.', 404));
    }
    DUMMY_PLACES.splice(placeIndex, 1);
    res.status(200).json({ message: 'Place deleted.' });
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    addNewPlace,
    updatePlace,
    deletePlace
};