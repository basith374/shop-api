'use strict';
const { Op } = require('sequelize');
const { Category, Image } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const items = [
      ['Fish', 'fish'],
      ['Dairy', 'dairy'],
      ['Meat', 'meat'],
      ['Vegetables', 'vegetables'],
      ['Cooking', 'sugar'],
      ['Poultry', 'poultry'],
      ['Cakes', 'butter-scotch'],
      ['Snacks', 'shawarma'],
      ['Foods', 'unnakaya'],
      ['Desserts', 'desserts'],
      ['Home Essentials', 'lifebuoy'],
      ['Personal care', 'colgate'],
      ['Cleaning', 'tide'],
      ['Chocolates', 'chocolates'],
      ['Dry fruits & Nuts', 'dry-fruits'],
      ['Fruits', 'fruits'],
    ]
    return Promise.all(items.map(async i => {
      let image = await Image.findOne({
        where: {
          filename: { [Op.like]: '%' + i[1] + '%' }
        }
      })
      if(!image) return console.log('image not found:', i[1])
      return Category.create({
        name: i[0],
        ImageId: image.id
      })
    }))
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
