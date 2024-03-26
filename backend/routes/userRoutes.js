const express = require('express');
const router = express.Router();


const { signup, login,verify,getuserNumber,} = require('../controllers/usercontroller');


router.post('/signup', signup);
router.post('/login',login);
router.get('/verify/:token',verify);
router.get('/number/:id',getuserNumber)

module.exports = router;