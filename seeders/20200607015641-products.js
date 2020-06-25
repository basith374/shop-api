'use strict';
const { Category, Product, ProductVariant, Image } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const items = [
      ['Cooking', 'Loose Sugar', 'sugar', [['250g', 10], ['500g', 20], ['1kg', 35]]],
      ['Cooking', 'Ground pepper', 'pepper', [['50g', 40], ['100g', 80]]],
      ['Cooking', 'Loose Aatta', 'atta', [['1kg', 20], ['5kg', 100]]],
      ['Cooking', 'Sambar Powder', 'sambar', [['50g', 30]]],

      ['Cakes', 'Chocolate', 'butter-scotch', [['1kg', 900]]],
      ['Cakes', 'Butter scotch', 'butter-scotch2', [['1kg', 900]]],
      ['Cakes', 'Almond', 'almond', [['1kg', 900]]],
      ['Cakes', 'Red Velvet', 'velvet', [['1kg', 900]]],

      ['Snacks', 'Burger', 'burger', [['Regular', 55], ['Large', 85]]],
      ['Snacks', 'Pizza', 'Pizza', [['Regular', 55], ['Large', 85]]],
      ['Snacks', 'Shawarma', 'shawarma', [['Roll', 55], ['Plate', 85]]],

      ['Foods', 'Unnakaya', 'unnakaya', [['8 pcs', 80], ['16 pcs', 160]]],

      ['Desserts', 'Chocolate Pudding', 'desserts', [['1 ltr', 120]]],
      ['Desserts', 'Gajar Halwa', 'halwa', [['500g', 150]]],

      ['Meat', 'Beef', 'meat', [['1 kg', 180]]],
      ['Meat', 'Goat Meat', 'meat', [['1 kg', 240]]],
      ['Meat', 'Chicken', 'poultry', [['1 kg', 180]]],

      ['Fish', 'Salmon', 'meat', [['1 kg', 240]]],
      ['Fish', 'King fish', 'meat', [['1 kg', 340]]],
      ['Fish', 'Hamour', 'meat', [['1 kg', 490]]],

      ['Personal Care', 'Colgate Toothpaste', 'colgate', [['50 g', 29]]],

      ['Cleaning', 'Tide', 'tide', [['500 g', 98]]],

      ['Home Essentials', 'Lifebuoy Soap', 'lifebuoy', [['50 g', 30]]],

      ['Vegetables', 'Gourd', 'gourd', [['1kg', 20]]],
      ['Vegetables', 'Potatoes', 'potato', [['1kg', 30]]],
      ['Vegetables', 'Tomatoes', 'tomato', [['1kg', 28]]],
      ['Vegetables', 'Garlic', 'garlic', [['100g', 14]]],

      ['Fruits', 'Apples', 'apple', [['500g', 50]]],
      ['Fruits', 'Oranges', 'orange', [['500g', 30]]],
      ['Fruits', 'Watermelon', 'watermelon', [['1kg', 40]]],

      ['Dairy', 'Eggs', 'eggs', [['10 nos', 50]]],
      ['Dairy', 'Milk', 'milma', [['Toned', 22]]],
    ]
    const promises = items.map(async (i) => {
      return Promise.all([
        Category.findOne({
          where: { name: i[0] }
        }),
        Image.findOne({
          where: {
            filename: { [Op.like]: '%' + i[2] + '%' }
          }
        })
      ]).then(items => {
        let category = items[0]
        let image = items[1];
        return Product.create({
          name: i[1],
          CategoryId: category.id,
          ProductVariants: i[3].map(v => {
            return {
              name: v[0],
              price: v[1],
              purchasePrice: v[1],
              mrp: v[1],
              countable: false,
            }
          })
        }, {
          include: ProductVariant
        }).then(product => {
          return product.setImages([image]);
        })
      })
    })
    return Promise.all(promises)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Products', null, {}),
      queryInterface.bulkDelete('ProductVariants', null, {}),
      queryInterface.bulkDelete('ProductImages', null, {}),
    ]);
  }
};
