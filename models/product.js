'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    CategoryId: DataTypes.INTEGER,
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.ProductVariant);
    Product.belongsToMany(models.Image, { through: 'ProductImages' })
    Product.belongsTo(models.Category);
  };
  return Product;
};