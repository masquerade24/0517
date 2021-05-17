const DURInfo = require('../API/DURPrdlstInfoService');
const sequelize = require('sequelize');
const models = require('../models/');
const Op = sequelize.Op;

exports.showInfo = async (req, res) => {
    try {
        const drugs = await models.Mydrug.findAll({});
        const mixture = "null";
        let i = 0;
        let j = 0;
        for (i; i < drugs.length; i++) {
            for (j; j < drugs.length; j++) {
                if (drugs[i]["dataValues"]["itemName"] == drugs[j]["dataValues"]["mixtureItemName"])
                    mixture = drugs[i]["dataValues"]["itemName"];
            }
        }
        res.status(200).json({
            "data": drugs,
            "mixture": mixture,
        })
    } catch (err) {
        res.status(500).json({
            message: 'error at mydrugController.js'
        })
    };
};

exports.test = async (req, res) => {
    try {
        DURInfo.DURInfoService(req.body.itemName, (error, info) => {
            const name = info.slice(info.indexOf('<MIXTURE_ITEM_NAME>') + 19, info.indexOf('</MIXTURE_ITEM_NAME>'));
            res.status(200).json({
                MIXTURE_ITEM_NAME: name,
            })
        })
    } catch (err) {
        res.status(500).json({
            message: 'error at mydrugController.js'
        })
    };
};