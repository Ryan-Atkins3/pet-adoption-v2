const debug = require('debug')('app:routes:api:pet');
const debugError = require('debug')('app:error');
const express = require('express');
const { nanoid } = require('nanoid');
const dbModule = require('../../database');
const {newId} = require('../../database');


const petsArray = [
  { _id: '1', name: 'Fido', createdDate: new Date() },
  { _id: '2', name: 'Watson', createdDate: new Date() },
  { _id: '3', name: 'Loki', createdDate: new Date() },
];

//create a router
const router = express.Router();

//define routes
router.get('/api/pet/list', async (req, res, next) => {
  const pets = await dbModule.findAllPets();
  res.json(pets);
});

router.get('/api/pet/:petId', async (req, res, next) => {
  try {
  const petId = newId(req.params.petId);
  const pet = await dbModule.findPetById(petId);
  debug(pet)
  res.json(pet);
  } catch (err) {
    next(err);
  }
});
//create
router.put('/api/pet/new', (req, res, next) => {
  const petId = nanoid();
  const { species, name, gender } = req.body;
  const age = parseInt(req.body.age);
  
  const pet = {
    _id: petId,
    species, //species:species,
    name,
    age,
    gender,
    createdDate:new Date(),
  };

  //validation
  if (!species) {
    res.status(400).json({ error: 'Species required' });
  } else if (!name) {
    res.status(400).json({ error: 'Name required' });
  } else if (!gender) {
    res.status(400).json({ error: 'Gender required' });
  } else if (!age) {
    res.status(400).json({ error: 'Age required' });
  } else {
    petsArray.push(pet);
    res.json(pet);
  }
});
//update
router.put('/api/pet/:petId', async (req, res, next) => {
  const petId = req.params.petId;
  const update = req.body;
  debug(`update pet ${petId}, update`)

  const pet = await dbModule.findPetById(petId);
  if (!pet) {
    res.status(404).json({ error: 'Pet Not Found' });
  } else {
    if (species != undefined) {
      pet.species = species;
    }
    if (name != undefined) {
      pet.name = name;
    }
    if (age != undefined) {
      pet.age = parseInt(age);
    }
    if (gender != undefined) {
      pet.gender = gender;
    }
    pet.lastUpdated = new Date();
    res.json(pet);
  }
});

//delete
router.delete('/api/pet/:petId', (req, res, next) => {
  const petId = req.params.petId;
  const index = petsArray.findIndex((x) => x._id == petId);
  if (index < 0) {
    res.status(404).json({ error: 'Pet Not Found' });
  } else {
    petsArray.splice(index, 1);
    res.json({ message: 'Pet deleted' });
  }
});


//export router
module.exports = router;