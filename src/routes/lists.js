const express = require('express');

const { Add, GetAllList, AddTask, RemoveTask, UpdateTask } = require('../controllers/list');


const router = express.Router();


//my lists
router.get('/all', GetAllList);

//add list
router.post('/add', Add);

//one to list
router.put('/:id', AddTask);

//edit to list
router.put('/update/task/:id',UpdateTask);

router.put('/remove/:id', RemoveTask)



module.exports = router;