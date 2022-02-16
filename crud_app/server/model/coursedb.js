
const Sequelize = require("sequelize");
const sequelize = require("../database/conn");

const course = sequelize.define("mycourse",{
    cid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    course_name:{
        type: Sequelize.CHAR,
        allowNull: false,
    },
    duration:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    fees: {
        type: Sequelize.INTEGER,
        allowNull : false,
    }
   
});

module.exports = course;