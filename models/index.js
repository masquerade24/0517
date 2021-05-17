const Sequelize = require('sequelize');
const User = require('./user');
const Count = require('./count');
const DB_drug = require('./db_drug');
const Mydrug = require('./mydrug');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.DB_drug = DB_drug;
db.User = User;
db.Count = Count;
db.Mydrug = Mydrug;

DB_drug.init(sequelize);
User.init(sequelize);
Count.init(sequelize);
Mydrug.init(sequelize);

DB_drug.associate(db);
User.associate(db);
Count.associate(db);
Mydrug.associate(db);

module.exports = db;