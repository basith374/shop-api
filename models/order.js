'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: DataTypes.DOUBLE,
    customerId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    deliveryCharge: DataTypes.DOUBLE,
    total: DataTypes.DOUBLE,
    status: DataTypes.INTEGER,
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Customer);
    Order.belongsTo(models.Address);
    Order.hasMany(models.OrderItem);
  };
  return Order;
};