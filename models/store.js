'use strict';
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    locality: DataTypes.STRING,
    pincode: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {});
  Store.associate = function(models) {
    // associations can be defined here
  };
  return Store;
};