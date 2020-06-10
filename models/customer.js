'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {});
  Customer.associate = function(models) {
    // associations can be defined here
    Customer.hasMany(models.Order);
    Customer.hasMany(models.Address);
  };
  return Customer;
};