module.exports = (app) => {
  const user = require("../controller/user.controller.js");

  app.post("/user", user.create);

  app.get("/user/:userId", user.findOne);
};
