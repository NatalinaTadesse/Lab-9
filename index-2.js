const mysql = require("mysql");
const dbpassword = process.env.PASSWORD;
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const conn = mysql.createConnection({
  host: "mysql1-p2.ezhostingserver.com",
  database: "citdemo",
  user: "elms",
  password: dbpassword,
});

conn.connect(function (err) {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.get("/retrieve", function (req, res) {
  res.sendFile(__dirname + "/retrieverform.html");
});

app.post("/retrieve", function (req, res) {
  const email = req.body.email;

  const sql = "SELECT username, password FROM login WHERE email = ?";
  conn.query(sql, [email], function (err, result) {
    if (err) {
      console.error("Select error:", err);
      return res.status(500).send("Error retrieving password");
    }

    if (result.length > 0) {
      const username = result[0].username;
      const hashedPassword = result[0].password;
      res.send(
        `<h1>Username: ${username}</h1><p>Password: ${hashedPassword}</p>`,
      );
    } else {
      res.send("<h1>No account found with the provided email</h1>");
    }
  });
});

fs.appendFile("users.txt", "Saved Passwords", (err) => {
  if (err) throw err;
  console.log("Saved Passwords");
});

app.post("/submit", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const sql = "INSERT INTO Users (Username, Password, Email) VALUES (?, ?, ?)";

  conn.query(sql, [username, password, email], function (err, result) {
    if (err) throw err;
    res.send("<h1>Your account has been created!</h1>");
  });
});

app.listen(8080);


