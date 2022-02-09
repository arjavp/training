const Sequelize = require('sequelize');

const sequelize = new Sequelize('arjavp','arjavp','97QqSGeQpTsD8ZzX4jUywWX98mTbv92n' ,{
    dialect:"mysql",
    host:'15.206.7.200',
    port: 3310
});

module.exports =  sequelize;