const List = require('../models/lists');

const listValidator = require('../utils/validators/list-validator');

const User = require('../models/users');



module.exports = class list {

    static async Add(req, res, next) {
        try {
            const { error } = listValidator(req.body);
            if (error) {
                res.status(500).send({
                    message: "There may some technical error during adding list",
                    error: error.message
                })
            }
            const { owner } = req.body;
            const isValidUser = await User.findById(owner);
            console.log(isValidUser);
            if (!isValidUser || isValidUser.length <= 0) {
                return res.status(302).send({
                    message: "User not found",
                });

            };
            const list = new List({ ...req.body });
            const result = await list.save();
            isValidUser.list.push(result._id);
            await isValidUser.save();
            res.status(201).send({
                message: "List was added successfully",
                list: result
            });
            console.log(result);
            console.log(addUserProfile);
        } catch (error) {
            console.log('Error is on adding list endpoint' + error.message);
            return next(error);
        }
    };
    static async AddTask(req, res, next) {
        try {
            const id = req.params.id;

            const task = req.body;

            const list = await List.updateOne({ _id: id }, {
                $push: {
                    task: task
                }
            });

            return res.status(200).send(`added: ${list.modifiedCount} \n success:  ${list.acknowledged}`);
        } catch (error) {
            console.log('Error is on adding task list endpoint : \n' + error.message);
            return next(error);
        }
    };
    static async RemoveTask(req, res, next) {
        try {
            const list_id = req.params.id;


            const { id } = req.query;

            if (list_id.length < 24) {
                return res.status(400).send("Invalid id");
            }

            const list = await List.findById(list_id);
            console.log(list)

            if (!list || list.length <= 0) {
                return res.status(400).send(`Id: ${list_id} is invalid !`)
            }
            console.log(list.task)
            let indexOfElement = list.task.findIndex(obj => {
                return obj._id == id;
            });
            if (!list.task[indexOfElement] || list.task[indexOfElement].length == 0) {
                return res.status(400).send(`task ${indexOfElement}  not found !`);
            }
            await list.task[indexOfElement].remove({ _id: id });
            await list.save();
            return res.send(` Task :${indexOfElement}  was removed Successful `);
        } catch (error) {
            console.log('Error is on removing task list endpoint : \n' + error.message);
            return next(error);
        }
    };
    static async UpdateTask(req, res, next) {
        try {
            const list_id = req.params.id;
            let list = req.body.list;
            const { status, title, description } = req.body;
            const { id } = req.query;
            if (list_id.length < 24) {
                return res.status(400).send("Invalid id");
            }
            const list_data = await List.findById(list_id);
            console.log(list_data)
            if (!list_data || list_data.length <= 0) {
                return res.status(400).send(`Id: ${list_id} is invalid !`)
            }
            console.log(list_data.task)
            let indexOfElement = list_data.task.findIndex(obj => {
                return obj._id == id;
            });
            if (!list_data.task[indexOfElement] || list_data.task[indexOfElement].length == 0) {
                return res.status(400).send(`task ${indexOfElement}  not found !`);
            }

            const result = await List.updateOne({ "task._id": id }, {
                '$set': {
                    'task.$.list': list,
                    'task.$.status': status,
                    'task.$.title': title,
                    'task.$.description': description,

                }
            })

            return res.send(` Task  was updated Successful \n Result:${result}`);
        } catch (error) {
            console.log('Error is on updating task list endpoint : \n' + error.message);
            return next(error);
        }
    }
    static async GetAllList(req, res, next) {
        try {
            let lists = await List.find()
                .select('-__v ')
            if (!lists || lists.length <= 0) {
                return res.status(302).send({
                    message: "There is nothing yet ",
                    lists
                })
            }

            res.status(200).send({
                message: "All lists are : ",
                lists
            })
        } catch (error) {
            console.log('Error is on getting list endpoint : \n' + error.message);
            return next(error);
        }
    };

}