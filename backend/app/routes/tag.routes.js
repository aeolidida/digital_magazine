module.exports = app => {
    const tags = require("../controllers/tag.controller.js");
    const { authJwt } = require("../middleware");

    var router = require("express").Router();
  
    router.post("/", [authJwt.verifyToken], tags.create);
  
    router.get("/", tags.findAll);
  
    router.get("/:id", tags.findOne);
  
    router.put("/:id", [authJwt.verifyToken], tags.update);
  
    router.delete("/:id", [authJwt.verifyToken], tags.delete);
  
    app.use('/api/tags', router);
  };