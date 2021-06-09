const express = require("express");
const User = require("./user");
const Users = require("./usercontroller");
const jwt = require("./jwt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sugar Box TASK application." });
});

app.get("/login", Users.login);

jwt.validate(app);

app.get("/users", Users.findAll);
app.get("/users/:email", Users.findOne);
app.post("/users", Users.create);
app.post("/tasks", Users.createTask);
app.delete("/users/:email", Users.delete);

app.get("/tasks/:uid", Users.taskByUid);


