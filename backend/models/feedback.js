module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('feedbacks', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    activity_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    emotion_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: 1, max: 4 }
    },
    anonymous_session_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'feedbacks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
  };

  return Feedback;
};
