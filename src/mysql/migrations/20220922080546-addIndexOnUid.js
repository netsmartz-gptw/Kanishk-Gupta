'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addIndex('ChoreTransactions', ['choreId'])
  },

  async down (queryInterface, Sequelize) {
     queryInterface.removeIndex('ChoreTransactions', ['choreId'])
  }
};
