'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChoreTransactions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ChoreTransactions.init({

        chore_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        chore_day: { type: DataTypes.STRING, allowNull: false },
        choreId: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        completed:
        {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    }, {
        sequelize,
        modelName: 'ChoreTransactions'

    });
    return ChoreTransactions;
};