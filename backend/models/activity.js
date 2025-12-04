module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    professor_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    access_code: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Activity',
    timestamps: true
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.User, { foreignKey: 'professor_id' });
    Activity.hasMany(models.Feedback, { foreignKey: 'activity_id' });
  };

  return Activity;
};
