const express = require('express');

const { Add,
    GetAllList,
    AddTask, RemoveTask,
    UpdateTask, EditListName,
    DeleteListById } = require('../controllers/list');

const protect_access = require('../middlewares/auth');


const router = express.Router();


//my lists
router.get('/all', protect_access, GetAllList);

//add list
router.post('/add/:id', protect_access, Add);

//Edit list
router.put('/list/:id', protect_access, EditListName);

router.get("/hidden", protect_access, (req, res, next) => {
    if (!req.user) {
        return res.status(304).send("Invalid JWT token");
    }
    if (req.user == "admin") {
        return res.status(200).send("Here is hidden");
    } else {
        return res.send("You are not admin")
    }
})

//delete list by id
router.delete('/list/remove/:id', protect_access, DeleteListById);

//add new task to list
router.put('/:id', protect_access, AddTask);

//Update task in list
router.put('/task/update/:id', protect_access, UpdateTask);

//remove task from list
router.put('/task/remove/:id', protect_access, RemoveTask)



module.exports = router;