module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('PROFESSOR', 'ADMIN'),
      allowNull: false
    }
  }, {
    tableName: 'User',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Activity, { foreignKey: 'professor_id' });
  };

  return User;
};
