const sql = require("./db.js");


// constructor
const Task = function (task) {
    this.uid = task.uid;
    this.task_name = task.task_name;    
};


Task.createTask = (task, result) => {
    sql.query("INSERT INTO task SET ?", task, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id: res.insertId, ...task });
        result(null, { id: res.insertId, ...task });
    });
};

module.exports = Task;
