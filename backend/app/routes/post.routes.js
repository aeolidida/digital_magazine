module.exports = app => {
  const posts = require("../controllers/post.controller.js");
  const { authJwt, upload } = require("../middleware");

  const router = require("express").Router();

  router.post("/",[authJwt.verifyToken, upload.single("image")],  posts.create);

  router.get("/", posts.findAll);
  router.get("/popular", posts.findFivePopular);

  router.get("/:id", posts.findOne);

  router.put("/:id",[authJwt.verifyToken, upload.single("image")],  posts.update);

  router.delete("/:id", [authJwt.verifyToken], posts.delete);

  app.use('/api/posts', router);
};