'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PredefineChores',{
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey:true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      title:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      desc:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
    const predefinedChoresData = [
      {
        id: 1,
        title: 'Clean Room',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Clean up after dinner',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: 'Walk Dog',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: 'Vaccum',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: 'Set Table',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        title: 'Water Plants',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        title: 'Laundry',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        title: 'Empty Dishwasher',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        title: 'Pick Up Toys',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        title: 'Clean Bathroom',
        desc:'',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]

    await queryInterface.bulkInsert('PredefineChores', predefinedChoresData);    
  },
  

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('PredefineChores')
  }
};
