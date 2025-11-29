module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: { 
        type: DataTypes.UUID, 
        primaryKey: true, 
        defaultValue: sequelize.literal('gen_random_uuid()') 
    },
    activity_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    emotion_type: { 
        type: DataTypes.SMALLINT, 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: DataTypes.NOW 
    },
    anonymous_session_id: { 
        type: DataTypes.STRING(64) 
    }
  }, {
    tableName: 'Feedback',
    timestamps: false //because in migrations we don't use createdAt/ updatedAt
  });

  Feedback.associate = (models) => {
    //1 feedback belongs to 1 activity
    //Feedback.activity_id-> Activity.id
    Feedback.belongsTo(models.Activity, { foreignKey: 'activity_id' });
  };

  return Feedback;
}
