'use strict';
const { User } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      User.create({
        name: 'Bazi',
        email: 'basith374@gmail.com',
        roles: 'admin'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null, {}),
    ])
  }
};
