'use strict';
const home = require('../home.json');
const { Setting } = require('../models')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Setting.create({
      key: 'homepage',
      value: JSON.stringify(home)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Settings', null, {});
  }
};
