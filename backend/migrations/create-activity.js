'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Activity',{
      id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
        unique: true
      },

      professor_id:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {model: 'User', key: 'id'},
        onDelete: 'CASCADE',
        unique: true
      },

      access_code:{
        type: Sequelize.STRING(10),
        unique: true,
        allowNull: false
      },

      starts_at:{
        type: Sequelize.DATE,
        allowNull: false
      },

      ends_at:{
        type: Sequelize.DATE,
        allowNull: false
      },

      createdAt:{
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.literal('now()')
      },

      updatedAt:{
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.literal('now()')
      }

    });

    //check constraint starts_at < ends_at
    await queryInterface.addConstraint('Activity',{
      fields: ['starts_at', 'ends_at'],
      type: 'check',
      where:{
        starts_at:{[Sequelize.Op.lt]: Sequelize.col('ends_at')}
      },
      name: 'activity_starts_before_ends'
    });

    //indexes
    await queryInterface.addIndex('Activity', ['access_code']);
    await queryInterface.addIndex('Activity', ['professor_id', 'starts_at']);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Activity');
  }
};
