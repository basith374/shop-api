'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: DataTypes.STRING,
    value: DataTypes.TEXT
  }, {});
  Setting.associate = function(models) {
    // associations can be defined here
  };
  return Setting;
};