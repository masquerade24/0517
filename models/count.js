const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            itemName: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            efficiency: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Count',
            tableName: 'counts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
    }
};