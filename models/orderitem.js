'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: DataTypes.INTEGER,
    productVariantId: DataTypes.INTEGER,
    name: DataTypes.STRING, // capture name
    price: DataTypes.STRING, // capture price
    qty: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER,
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.ProductVariant);
    OrderItem.belongsTo(models.Store);
  };
  return OrderItem;
};