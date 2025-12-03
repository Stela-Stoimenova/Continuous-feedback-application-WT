'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
        unique: true
      },

      email:{
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      name:{
        type:Sequelize.STRING,
        allowNull: false
      },

      password_hash:{
        type: Sequelize.STRING,
        allowNull: false
      },

      role:{
        type: Sequelize.ENUM('PROFESSOR', 'ADMIN'),
        allowNull:false,
        defaultValue: 'PROFESSOR'
      },

      createdAt:{
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue:Sequelize.literal('now()')
      },

      updatedAt:{
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('now()')
      }

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
