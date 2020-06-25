'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    ImageId: DataTypes.INTEGER,
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Product);
    Category.belongsTo(models.Image);
  };
  return Category;
};