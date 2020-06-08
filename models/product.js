'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    categoryId: DataTypes.INTEGER,
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.ProductVariant, { foreignKey: 'productId', onDelete: 'CASCADE' });
    Product.belongsToMany(models.Image, { through: 'ProductImages' })
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };
  return Product;
};