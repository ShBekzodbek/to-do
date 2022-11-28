const express = require('express');

const { Add, GetAllList, addTask ,removeTask} = require('../controllers/list');


const router = express.Router();


//my lists
router.get('/all', GetAllList);

//add list
router.post('/add', Add);

//one to list
router.put('/:id', addTask);

//edit to list
router.put('lists/edit/:id', (req, res) => {
    res.send('edit to list')
});

router.put('/remove/:id',removeTask)



module.exports = router;