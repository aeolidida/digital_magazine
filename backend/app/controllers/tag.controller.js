const db = require("../models");
const Tag = db.tags;

exports.create = async (req, res) => {  
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const tag = {
    name : req.body.name
  }

  try {
    const data = await Tag.create(tag)
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Tag."
    });
  }  
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try{
    const data = await Tag.findByPk(id);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Tag with id=${id}.`
      });
    }
  } catch(err){
    res.status(500).send({
      message: err.message || "Error retrieving Tag with id=" + id
    });
  }
};

exports.findAll = async (req, res) => {
  try{
    const data = await Tag.findAll();
    res.status(200).send(data);
  } catch(err){
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tags."
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try{
    const result = await Tag.update(req.body, {
      where: { id: id }
    });
    if (result ==1) {
      res.status(200).send({
        message: "Tag was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Tag with id=${id}. Maybe Tag was not found or req.body is empty!`
      });
    }
  } catch(err){
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tags."
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try{
    const result = await Tag.destroy({
      where: { id: id }
    });
    if (result ==1) {
      res.status(200).send({
        message: "Tag was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Tag with id=${id}. Maybe Tag was not found!`
      });
    }
  } catch(err){
    res.status(500).send({
      message: err.message || `Could not delete Tag with id=${id}`
    });
  }
};
