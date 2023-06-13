'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChoreTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      choreId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: 0
      },
      chore_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      chore_day: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChoreTransactions');
  }
};