const db = require("../models");
const Post = db.posts;
const Comment = db.comments;
const User = db.user;
const sequelize = db.sequelize;


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
    if (!req.body.text) {
      res.status(400).send({
        message: "Text can not be empty!"
      });
      return;
    }
    if (!req.body.postId) {
      res.status(400).send({
        message: "Post is not specified!"
      });
      return;
    }

    const comment = {
        text: req.body.text,
        userId: req.userId,
        postId: req.body.postId
    };

    try{
      const post = await Post.findByPk(req.body.postId);

      if (!post){
        res.status(404).send({
          message:
            `Post with id=${req.body.postId} was not found.`
        });
        return;
      }

      const t = await sequelize.transaction();

      try{

        const postUpdated = {commentCount: post.commentCount + 1}
        await Post.update(postUpdated, {where: { id: req.body.postId }}, { transaction: t });
        const data = await Comment.create(comment, { transaction: t });
        await t.commit();
        res.status(201).send(data);

      } catch(err){

        await t.rollback();
        res.status(500).send({
          message:
            err.message || `Some error occurred while transaction.`
        });

      }
      
    } catch(err){
      res.status(500).send({
        message:
          err.message || `Some error occurred while creating the Comment.`
      });
    }

};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try{
    const data = await Comment.findByPk(id, {
      include: [
      {
        model: User,
        as: "user",
        attributes: ['id', 'username']
      }
      ],
      attributes: ["id", "text", "postId", "createdAt", "updatedAt"]
    });
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({
        message:  err.message || `Cannot find Comment with id=${id}.`
      });
    }
  } catch(err){
    res.status(500).send({
      message:  err.message || `Error retrieving Comment with id=${id}.`
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Comment.findAll({
      include: [
      {
        model: User,
        as: "user",
        attributes: ['id', 'username']
      }
      ],
      attributes: ["id", "text", "postId", "createdAt", "updatedAt"]
    });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving comments."
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const comment = await Comment.findByPk(id);

    if(!comment) {
      res.status(404).send({
        message: `Can not find comment with id=${id}`
      });
      return;
    }

    const flag = await isModeratorOrAdmin(userId);
    if (comment.userId != userId && !flag){
      res.status(403).send({
        message: `Cannot update Comment with id=${id}. This comment can be updated only by its author.`
      });
      return;
    }

    const result = await Comment.update(req.body, {
      where: { id: id }
    });
    if (result == 1) {
      res.status(200).send({
        message: "Comment was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Comment with id=${id}. Maybe req.body is empty!`
      });
    }

  } catch (err) {
    res.status(500).send({
      message: err.message || `Error updating Comment with id=${id}.`
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const comment = await Comment.findByPk(id);

    if(!comment) {
      res.status(404).send({
        message: `Can not find comment with id=${id}.`
      });
      return;
    }

    const flag = await isModeratorOrAdmin(userId);
    if (comment.userId != userId && !flag){
      res.status(403).send({
        message: `Cannot delete Comment with id=${id}. This comment can be updated only by its author.`
      });
      return;
    }

    const post = await Post.findByPk(comment.postId);

    const t = await sequelize.transaction();

    try{
      
      if (post) {
        const postUpdated = {commentCount: post.commentCount - 1}
        await Post.update(postUpdated, {where: { id: req.body.postId }}, { transaction: t });
      }

      const result = await Comment.destroy({
        where: { id: id }
      }, { transaction: t });

      if (result == 1) {
        await t.commit();
        res.status(201).send({
          message: "Comment was deleted successfully."
        })
      } else {
        await t.rollback();
        res.send({
          message: `Cannot delete Commeny with id=${id}.`
        });
      }
      
    } catch(err){

      await t.rollback();
      res.status(500).send({
        message:
          err.message || `Some error occurred while transaction.`
      });
    }

  } catch (err) {
    res.status(500).send({
      message: err.message || `Error deleting Comment with id=${id}.`
    });
  }

};
