module.exports= (sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize.literal('gen_random_uuid()')
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        password_hash:{
            type: DataTypes.STRING,
            allowNull: false
        },
        role:{
            type: DataTypes.ENUM('PROFESSOR', 'ADMIN'),
            allowNull: false
        }
    },{
        tablesName: 'User',
        timestamps: true //because in migrations we use createdAt/ updatedAt
    });

    User.associate=(models)=>{
        //1 user can have many activities
        //User.id -> Activity.professor_id
        User.hasMany(models.Activity, {foreignKey:'professor_id'});
    };

    return User;
}