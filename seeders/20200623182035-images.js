'use strict';
const { Image } = require('../models');

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
    const images = [
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/pizza.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/burger.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/shawarma.jpeg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/unnakaya.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/Gajar-Ka-Halwa.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/butter-scotch.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/butter-scotch2.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/almond-cake.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/red-velvet.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/sugar.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/black-pepper.png',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/atta.jpeg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/eastern-sambar.png',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/colgate.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/tide.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/lifebuoy.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/potatoes.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/gourd.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/tomato.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/garlic.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/apples.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/orange.jpg',
      'https://res.cloudinary.com/bluroe-labs/image/upload/shop-images/watermelon.jpg',
    ]
    return Promise.all(
      images.map(i => Image.create({ filename: i }))
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
