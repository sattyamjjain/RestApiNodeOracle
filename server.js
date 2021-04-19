const express = require("express");
var cors = require("cors");
var oracleDb = require("oracledb");
const dbConfig = require("./app/config/db.config.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

// require('./app/routes/user.routes')(app);

app.get("/user", function (req, res) {
  "use strict";

  oracleDb.getConnection(dbConfig, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message,
        })
      );
      return;
    }

    connection.execute(
      "SELECT * FROM USER",
      {},
      {
        outFormat: oracleDb.OBJECT, // Return the result as Object
      },
      function (err, result) {
        if (err) {
          res.set("Content-Type", "application/json");
          res.status(500).send(
            JSON.stringify({
              status: 500,
              message: "Error getting the user",
              detailed_message: err.message,
            })
          );
        } else {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(result.rows));
        }
        // Release the connection
        connection.release(function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("GET /user : Connection released");
          }
        });
      }
    );
  });
});

app.post("/user", function (req, res) {
  "use strict";
  if ("application/json" !== req.get("Content-Type")) {
    res
      .set("Content-Type", "application/json")
      .status(415)
      .send(
        JSON.stringify({
          status: 415,
          message: "Wrong content-type. Only application/json is supported",
          detailed_message: null,
        })
      );
    return;
  }
  oracleDb.getConnection(dbConfig, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res
        .set("Content-Type", "application/json")
        .status(500)
        .send(
          JSON.stringify({
            status: 500,
            message: "Error connecting to DB",
            detailed_message: err.message,
          })
        );
      return;
    }
    connection.execute(
      "INSERT INTO user VALUES " + "(:id, :name, :email,:mobileNo) ",
      [req.body.id, req.body.name, req.body.email, req.body.mobile_no],
      {
        autoCommit: true,
        outFormat: oracleDb.OBJECT, // Return the result as Object
      },
      function (err, result) {
        if (err) {
          // Error
          res.set("Content-Type", "application/json");
          res.status(400).send(
            JSON.stringify({
              status: 400,
              message:
                err.message.indexOf("ORA-00001") > -1
                  ? "User already exists"
                  : "Input Error",
              detailed_message: err.message,
            })
          );
        } else {
          // Successfully created the resource
          res
            .status(201)
            .set("Location", "/user/" + req.body.USER_NAME)
            .end();
        }
        // Release the connection
        connection.release(function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /user : Connection released");
          }
        });
      }
    );
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
