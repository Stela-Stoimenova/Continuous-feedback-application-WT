module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    activity_id: { type: DataTypes.UUID, allowNull: false },
    emotion_type: { type: DataTypes.SMALLINT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    anonymous_session_id: { type: DataTypes.STRING(64) }
  }, { tableName: 'Feedback', timestamps: false });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Activity, { foreignKey: 'activity_id' });
  };

  return Feedback;
};
