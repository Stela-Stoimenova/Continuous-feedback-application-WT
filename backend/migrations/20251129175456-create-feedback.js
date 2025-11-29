'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Feedback',{
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false
      },

      activity_id:{
        type: Sequelize.UUID,
        allowNull:false,
        references:{model: 'Activity', key: 'id'},
        onDelete: 'CASCADE'
      },

      emotion_type:{
        type:Sequelize.SMALLINT,
        allowNull: false
      },

      created_at:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()')
      },

      anonymous_session_id:{
        type: Sequelize.STRING(64),
        allowNull: true
      }
    });

    //emotion_type IN (1,2,3,4)
    await queryInterface.addConstraint('Feedback', {
      fields:['emotion_type'],
      type: 'check',
      where:{
        emotion_type:{[Sequelize.Op.in]: [1,2,3,4]}
      },
      name: 'feedback_emotion_type_valid'
    });

    //indexes
    await queryInterface.addIndex('Feedback', ['activity_id', 'created_at']);
    await queryInterface.addIndex('Feedback', ['activity_id', 'anonymous_session_id']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Feedback');
  }
};
