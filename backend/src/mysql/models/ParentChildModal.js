'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ParentChild extends Model {
        static associate(models) {
            // define associations here
        }
    }
    ParentChild.init(

        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            parent_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            },
            child_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ParentChild',
            tableName: 'parent_child',
            timestamps: false
        }
    );
    return ParentChild;
}