const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MEDIA CONFIGURATION


const path = require("path");

app.get("/api/media/posts/:filename", (req,res)=>{
  let imagePath = path.join(__dirname, 'app/media/posts/', req.params.filename)
  res.sendFile(imagePath);
})

// ROUTES CONFIGURATION

require('./app/routes/auth.routes')(app);

require("./app/routes/tag.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/comment.routes")(app);

// DATABASE CONFIGURATION

const db = require("./app/models");

const Role = db.role;
const Tag = db.tags;

/// Удаляет все таблицы и создает заново, после чего синхронизируется с базой данных. 
/// Закомментировать, если удаление и создание таблиц заново не требуется.

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });

  Tag.create({
    id: 1,
    name: "Новости"
  });

  Tag.create({
    id: 2,
    name: "Наука"
  });

  Tag.create({
    id: 3,
    name: "Общество"
  });
}

///

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});