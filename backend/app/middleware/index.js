const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const upload = require("./uploadImage");


module.exports = {
  upload,
  authJwt,
  verifySignUp
};