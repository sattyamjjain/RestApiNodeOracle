const oracle = require('./db.js')

const User = function (user) {
  this.id = user.id;
  this.email = user.email;
  this.name = user.name;
  this.mobile_no = user.mobile_no;
};

User.create = (newUser, result) => {
  oracle.execute("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
};

User.findById = (userId, result) => {
  oracle.execute(`SELECT * FROM user WHERE id = ${userId}`, (err, res) => {
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


module.exports = User;