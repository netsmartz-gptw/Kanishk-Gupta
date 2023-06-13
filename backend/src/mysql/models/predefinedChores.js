'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PredefineChores extends Model {
        static associate(models) {
            // define association here
          }
    }
PredefineChores.init({
    title:{
        type:DataTypes.STRING,
        allowNull:false,    
    },
    desc: DataTypes.STRING
    },  {
    sequelize,
    modelName:'PredefineChores',
    paranoid:true
});
    return PredefineChores
}
