'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    name: DataTypes.STRING,
    houseName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    landmark: DataTypes.STRING,
    locality: DataTypes.STRING,
    pincode: DataTypes.STRING,
    phoneno: DataTypes.STRING,
    type: DataTypes.STRING, // work, home
    CustomerId: DataTypes.INTEGER,
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    Address.belongsTo(models.Customer);
    Address.hasMany(models.Order);
  };
  return Address;
};