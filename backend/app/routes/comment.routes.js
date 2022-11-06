module.exports = app => {
  const comments = require("../controllers/comment.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();


  router.post("/", [authJwt.verifyToken], comments.create);

  router.get("/", comments.findAll);

  router.get("/:id", comments.findOne);

  router.put("/:id", [authJwt.verifyToken], comments.update);

  router.delete("/:id", [authJwt.verifyToken], comments.delete);

  app.use('/api/comments', router);
};