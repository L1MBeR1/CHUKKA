
const express = require('express');
const router = express.Router();
// const db = require('../models/db');

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {

  res.render('home', {  });
});

module.exports = router;
