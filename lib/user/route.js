var express = require('express');
var router = express.Router();
var controller = require('./controller');

//router.post('/', controller.create);

router.get('/', controller.get);



module.exports = router;
