
const express = require('express');
const router = express.Router();
const path = require('path');
// const db = require('../models/db');




router.get('/', (req, res) => {

  res.render('home', {  });
});

module.exports = router;
