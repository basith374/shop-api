'use strict';
const { Category } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return Promise.all([
      Category.create({
        name: 'Fish',
      }),
      Category.create({
        name: 'Dairy',
      }),
      Category.create({
        name: 'Meat',
      }),
      Category.create({
        name: 'Vegetables',
      }),
      Category.create({
        name: 'Fruits',
      }),
      Category.create({
        name: 'Cooking',
      }),
      Category.create({
        name: 'Poultry',
      }),
      Category.create({
        name: 'Electronics',
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
