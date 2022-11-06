const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// AUTH MODELS

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["user", "admin", "moderator"];

// MAGAZINE MODELS

db.posts = require("./post.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.tags = require("./tag.model.js")(sequelize, Sequelize);

db.posts.hasMany(db.comments, { as: "comments", onDelete: 'cascade'  });
db.comments.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post", 
  allowNull: false
});

db.tags.hasMany(db.posts, { as: "posts", onDelete: 'cascade' });
db.posts.belongsTo(db.tags, {
    foreignKey: "tagId",
    as: "tag",  
    allowNull: false
});

db.user.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  allowNull: false
});

db.user.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
  allowNull: false
});

module.exports = db;