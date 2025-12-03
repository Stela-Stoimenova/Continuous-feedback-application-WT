module.exports=(sequelize, DataTypes)=>{
    

    const Activity= sequelize.define('Activity', {
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize.literal('gen_random_uuid()')
        },
        professor_id:{
            type:DataTypes.UUID,
            allowNull: false
        },
        access_code:{
            type: DataTypes.STRING(10),
            unique:true,
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
    },{
        tableName: 'Activity', 
        timestamps: true //because in migrations we use createdAt/updatedAt
    });

    Activity.associate=(models)=>{
        //Activity.professor_id -> User.id
        Activity.belongsTo(models.User,{foreignKey:'professor_id'});

        //Activity.id -> Feedback.activity_id
        Activity.hasMany(models.Feedback,{foreignKey:'activity_id'});
    };

    return Activity;
}