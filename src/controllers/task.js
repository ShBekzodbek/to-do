const List = require('../models/lists');
const User = require('../models/users');
const Task = require('../models/task');


module.exports = class task {

    static async Add(req, res, next) {
        try {
            const { list } = req.body;
            const isValidList = await List.findById(list);
            console.log(isValidList);
            if (!isValidList || isValidList.length <= 0) {
                return res.status(302).send({
                    message: "List not found",
                });

            };
            const task = new Task({ ...req.body });
            const result = await task.save();
            isValidList.task.push(result._id);
            await isValidList.save();
            res.status(201).send({
                message: "Task was added successfully",
                task: result
            });
            console.log(result);
        } catch (error) {
            res.status(500).send({
                message: "There may some technical errors in Adding task",
                error: error.message
            })
        }
    };
    static async GetOneById(req, res, next) {

    };
    static async Search(req, res, next) {

    };
    static async GetAllTask(req, res, next) {
        try {
            console.log('kirdi');
            let task = await Task.find()
                .populate("list", "-__v -_id")
                .select('-__v -_id');
            console.log(task);
            console.log('kirdi keldi');
            if (!task || task.length <= 0) {
                return res.status(302).send({
                    message: "There is nothing yet ",
                    task
                })
            }

            res.status(200).send({
                message: "All task are : ",
                task
            })
        } catch (error) {
            res.status(500).send({
                message: "There may some technical errors in getting  all task",
                error: error.message
            })
        }
    };


}