'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    purchasePrice: DataTypes.DOUBLE,
    mrp: DataTypes.DOUBLE,
    countable: DataTypes.BOOLEAN,
  }, {});
  ProductVariant.associate = function(models) {
    // associations can be defined here
  };
  return ProductVariant;
};