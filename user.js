const sql = require("./db.js");

// constructor
const User = function (user) {
    this.email = user.email;
    this.password = user.password;
    this.status = user.status;
};



User.create = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};


User.findById = (uid, result) => {
    sql.query(`SELECT * FROM users WHERE id = '${uid}' and status = 1`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

User.findByEmail = (email, result) => {
    console.log(email)
    let query = "SELECT * FROM users WHERE email = '"+ email +"'";
    if(email != 'admin') query += ' and status = 1';
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};


User.login = (email, password, result) => {
    sql.query(`SELECT id FROM users WHERE email = '${email}' and password = '${password}' and status = 1`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        
        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

User.getAll = result => {
    sql.query("SELECT * FROM users where email != 'admin' and status = 1", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
};


User.getTaskByUid = async (uid, result) => {
    sql.query(`SELECT * FROM task where uid = ${uid} `, (err, res) => {
        if (err) {
            console.log("error: ", err);
            return;
        }
        result(null, res);
    });
};

User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?",
        [user.email, user.name, user.active, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found User with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated user: ", { id: id, ...user });
            result(null, { id: id, ...user });
        }
    );
};

User.remove = (email, result) => {
    sql.query("UPDATE users SET status = 0 WHERE email = ? and status = 1", email, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted user with email: ", email);
        result(null, res);
    });
};

User.removeAll = result => {
    sql.query("UPDATE users SET status = 0 WHERE status = 1 and email != 'admin'", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} users`);
        result(null, res);
    });
};

module.exports = User;
