'use strict';
const { Customer, Address } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      Customer.create({
        name: 'Bazi',
        active: true,
        Addresses: [
          {
            streetAddress: 'Kenz',
            locality: 'Dharmadam',
            pincode: '670106',
            landmark: 'Near coronation school',
            type: 'home',
          }
        ]
      }, {
        include: Address
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Customers', null, {}),
      queryInterface.bulkDelete('Addresses', null, {}),
    ])
  }
};
