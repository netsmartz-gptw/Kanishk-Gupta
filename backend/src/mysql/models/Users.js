'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    roleId: DataTypes.INTEGER.UNSIGNED,
    dob: DataTypes.STRING,
    gender: DataTypes.STRING,
    userPin: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING(128),
    state: DataTypes.STRING(64),
    zip: DataTypes.STRING(32),
    phoneNo: DataTypes.STRING(32),
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    profileImageUrl: {
      type: DataTypes.STRING(2083)
    },
    awsS3Key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    paranoid: true
  });

  Users.associate = (models) => {

    Users.belongsToMany(models.Users, {
      through: models.ParentChild,
      as: 'parent',
      foreignKey: 'child_id',
    });

    Users.belongsToMany(models.Users, {
      through: models.ParentChild,
      as: 'children',
      foreignKey: 'parent_id',
    });
  }

  return Users;
};