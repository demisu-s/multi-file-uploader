'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fileUploaders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  fileUploaders.init({
    description: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fileUploaders',
    timestamps:false
  });
  return fileUploaders;
};