const express = require('express');


const router = express.Router();


const { Add ,GetAllTask} = require('../controllers/task');

//Get All tasks
router.get('/tasks', GetAllTask);

//add to do 
router.post('/add', Add);

//edit to do 
router.put('lists/edit/:id', (req, res) => {
    res.send('edit task')
});



module.exports = router;