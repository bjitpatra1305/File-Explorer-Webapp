var express = require('express');
var router = express.Router();

/* Serve index.html */
router.get('/', function(req, res, next) {
  res.sendFile('./public/index.html');
});

module.exports = router;