'use strict';
const { Customer, Address } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      Customer.create({
        name: 'Bazi',
        email: 'basith374@gmail.com',
        Addresses: [
          {
            // name: 'Default',
            houseName: 'Kenz',
            streetAddress: 'Valakathan vayal road',
            locality: 'Dharmadam',
            pincode: '670106',
            landmark: 'Near coronation school',
            type: 'home',
            phoneno: '9995243664',
          },
          {
            // name: 'Default',
            houseName: 'Sana',
            streetAddress: 'National Highway',
            locality: 'Dharmadam',
            pincode: '670106',
            landmark: 'Behind post office',
            type: 'home',
            phoneno: '9995243664',
          },
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
