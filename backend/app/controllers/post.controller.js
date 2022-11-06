const db = require("../models");
const Post = db.posts;
const Tag = db.tags;
const Comment = db.comments;
const User = db.user;

async function isModeratorOrAdmin(userId){
  const user = await User.findByPk(userId);

  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name == "admin" || roles[i].name === "moderator") {
      return true;
    }
  }
  
  return false;
}

exports.create = async (req, res) => {
    if (!req.body.title) {
      res.status(400).send({
        message: "Title can not be empty!"
      });
      return;
    }
    if (!req.body.description) {
      res.status(400).send({
        message: "Description can not be empty!"
      });
      return;
    } 
    if (!req.body.content) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }
    if (!req.file) {
      res.status(400).send({
        message: "Image is not attached!"
      });
      return;
    }
    if (!req.body.tagId) {
      res.status(400).send({
        message: "Tag is not specified!"
      });
      return;
    }
    if(req.body.commentCount){
      delete req.body.commentCount;
    }

    const post = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        tagId: req.body.tagId,
        userId: req.userId,
        image: req.file.filename
    };
  
    try{
      const data = await Post.create(post);
      res.status(201).send(data);
    } catch(err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Post."
      });
    }
  };


exports.findAll = async (req, res) => {
  try{
    const data = await Post.findAll({
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ['id', 'text'],
          include: [
            {
              model: User,
              as: "user",
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: ['id', 'username']
        },
        {
          model: Tag,
          as: "tag",
          attributes: ['id', 'name']
        }
      ],
      attributes: ["id", "title", "description", "content", "image", "createdAt", "updatedAt", "commentCount"],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving posts."
    });
  }
};

exports.findFivePopular = async (req, res) => {
  try{
    const data = await Post.findAll({
      attributes: ["id", "title", "description", "content", "image", "createdAt", "updatedAt", "commentCount"],
      order: [['commentCount', 'DESC']],
      limit: 5,
    });
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving posts."
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try{
    const data = await Post.findByPk(id, {
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ['id', 'text'],
          include: [
            {
              model: User,
              as: "user",
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: ['id', 'username']
        },
        {
          model: Tag,
          as: "tag",
          attributes: ['id', 'name']
        }
      ],
      attributes: ["id", "title", "description", "content", "image", "createdAt", "updatedAt", "commentCount"]
    });
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Post with id=${id}.`
      });
    }
  } catch(err){
    res.status(500).send({
      message: err.message || `Error retrieving Post with id=${id}.`
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  if(req.body.commentCount){
    delete req.body.commentCount;
  }

  try {
    const post = await Post.findByPk(id);

    if(!post) {
      res.status(404).send({
        message: `Can not find post with id=${id}.`
      });
      return;
    }

    const flag = await isModeratorOrAdmin(userId);
    if (post.userId != userId && !flag){
      res.status(403).send({
        message: `Cannot update Post with id=${id}. This post can be updated only by its author.`
      });
      return;
    }

    const result = await Post.update(req.body, {
      where: { id: id }
    });
    if (result == 1) {
      res.status(200).send({
        message: "Post was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot delete Post with id=${id}.`
      });
    }

  } catch (err) {
    res.status(500).send({
      message: err.message || `Error updating Post with id=${id}.`
    });
  }
};


exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const post = await Post.findByPk(id);

    if(!post) {
      res.status(404).send({
        message: `Can not find post with id=${id}.`
      });
      return;
    }

    const flag = await isModeratorOrAdmin(userId);
    if (post.userId != userId && !flag){
      res.status(403).send({
        message: `Cannot delete Post with id=${id}. This post can be deleted only by its author.`
      });
      return;
    }

    const result = await Post.destroy({
      where: { id: id }
    });
    if (result == 1) {
      res.status(200).send({
        message: "Post was deleted successfully."
      });
    } else {
      res.send({
        message: `Cannot delete Post with id=${id}.`
      });
    }
  
  } catch (err) {
    res.status(500).send({
      message: err.message || `Error deleting Post with id=${id}.`
    });
  }

};