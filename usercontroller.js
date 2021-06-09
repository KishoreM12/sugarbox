const User = require("./user.js");
const Task = require("./task");

const jwt = require("./jwt")

exports.login = async (req, res) => {
    console.log(req.query.email)
    if (!req.query.email || !req.query.password) {
        return res.status(400).send({
            message: "username or password invalid!"
        });
    }

    User.login(req.query.email, req.query.password, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found User with email ${req.query.email}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving User with email " + req.query.email
                });
            }
        } else {
            if (data) {
                data.id != null ? data.auth_token = 'zxcvasdf' + data.id : '';
                data.token = await jwt.generate(data.id, data.email)
            }
            return res.send(data);
        }
    });

};


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //Validate user

    User.findByEmail(req.body.email, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {


                const user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    status: 1
                });

                User.create(user, (err, data) => {
                    if (err)
                        return res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the User."
                        });
                    else {
                        data.msg = "User created successfully"
                        return res.send(data);
                    }
                });
            }
        } else return res.send({ "msg": "User already exists with email " + req.body.email });
    });


};


exports.createTask = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const task = new Task({
        uid: req.body.uid,
        task_name: req.body.task_name
    });

    Task.createTask(task, (err, data) => {
        if (err)
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else {
            data.msg = "User created successfully"
            res.send(data);
        }
    });

};

exports.findAll = async (req, res) => {
    User.getAll(async (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else {
            res.send(data);
        }
    });
};


exports.taskByUid = async (req, res) => {
    User.getTaskByUid(req.params.uid, async (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else {
            res.send(data);
        }
    });
};

async function processTask(uid) {
    return new Promise((resolve, reject) =>
        User.getTaskByUid(uid, (err, task) => resolve(task))
    )
}



exports.findOne = async (req, res) => {
    var s = checkEmail(req.params.email)
    if (s) {
        User.findByEmail(req.params.email, async (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with email ${req.params.email}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving User with email " + req.params.email
                    });
                }
            } else {
                User.getTaskByUid(data.id, (err, task) => {
                    data.task = task;
                    res.send(data);    
                }) 
            }
        });
    }
    else {

        User.findById(req.params.email, async (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.params.email}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving User with id " + req.params.email
                    });
                }
            } else {
                User.getTaskByUid(data.id, (err, task) => {
                    data.task = task;
                    res.send(data);    
                })                
            }
        });
    }
};

function checkEmail(email) {
    try {
        let e = parseInt(email);
        if (isNaN(e)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("checkEmail :" + err)
        return true;
    }
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    console.log(req.body);

    User.updateById(
        req.params.userId,
        new User(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.params.userId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating User with id " + req.params.userId
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    User.remove(req.params.email, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.email}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete User with id " + req.params.email
                });
            }
        } else res.send({ message: `User was deleted successfully!` });
    });
};

exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        else res.send({ message: `All Users were deleted successfully!` });
    });
};
