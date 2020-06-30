'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    OrderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    productVariantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING, // capture name
    price: DataTypes.STRING, // capture price
    qty: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
    ImageId: DataTypes.INTEGER,
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.ProductVariant);
    OrderItem.belongsTo(models.Store);
    OrderItem.belongsTo(models.Image);
  };
  return OrderItem;
};