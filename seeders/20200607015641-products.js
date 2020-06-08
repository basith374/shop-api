'use strict';
const { Category, Product, ProductVariant } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let category = await Category.findOne({
      where: { name: 'Cooking' }
    })
    return category.createProduct({
      name: 'Sugar',
      ProductVariants: [
        {
          name: 'Loose',
          price: 10,
          purchasePrice: 10,
          mrp: 10,
          countable: false,
        }
      ]
    }, {
      include: ProductVariant
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return Product.destroy({
      where: { name: 'Sugar' }
    })
  }
};
