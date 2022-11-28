const express = require('express');

const { register, logIn, getUsers, logOut, editUser } = require('../controllers/user');

const router = express.Router();

const protect_access = require('../middlewares/auth');


//register
router.post('/register', register);


//login
router.post('/login', logIn);

//get all users
router.get('/users', protect_access, getUsers);

//log out
router.delete('/logout/:id', protect_access, logOut);

//edit profil
router.put('/edit/:id', protect_access, editUser);




module.exports = router;
