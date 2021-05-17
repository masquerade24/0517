const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            itemName: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            mixtureItemName: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Mydrug',
            tableName: 'mydrugs',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        
    }
};