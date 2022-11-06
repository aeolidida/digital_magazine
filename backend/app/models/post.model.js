module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      commentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    });

    return Post;
};