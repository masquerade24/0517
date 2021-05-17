const drugInfo = require('../API/drugInfo');
const DURInfo = require('../API/DURPrdlstInfoService');
const sequelize = require('sequelize');
const models = require('../models/');
const Op = sequelize.Op;

// e약은요에서 증상으로 검색하기
exports.symptomSearch = async (req, res) => {
    try {
        const symptom = await req.body.symptom
        if (symptom) {
            drugInfo.drugBySymptom(symptom, (error, info) => {
                console.log(info);
                res.status(200).json({
                    // itemName: info["itemName"],
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

// Count 테이블에서 증상으로 검색하기
exports.symptomSearch2 = async (req, res) => {
    try {
        const drug = await models.Count.findAll({
            where: {
                efficiency: {
                    [Op.substring]: req.body.symptom,
                }
            }
        });
        console.log(drug[0]["dataValues"]["itemName"]);
        // DB에 count가 부여된 알약이 있으면 그것 먼저 보여주고
        // '더 보기'를 클릭하면 API를 조회하는 것으로 해야할 듯
        res.status(200).json({
            message: '데헤헷',
            data: drug,
        })
    } catch (err) {
        res.status(500).json({
            message: 'case 1: 내부 서버 오류 from symptomSearch2',
            err: err,
        })
    }
}

// 음각, 색, 모양을 받아서 약 검색하기
exports.search = async (req, res) => {
    console.log('drug/search 호출됨');
    console.log(req.body.itemName);
    try {
        const drug = await foundDrug(req, res);
        if (drug) {
            drugInfo.drugByName(drug.itemName, (error, info) => {
                res.status(200).json({
                    itemName: drug.itemName,
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

// 알약의 이름만을 받아서 검색하기
exports.search2 = async (req, res) => {
    console.log('drug/search 호출됨');
    console.log(req.body.itemName);
    try {
        if (req.body.itemName) {
            drugInfo.drugByName(req.body.itemName, (error, info) => {
                res.status(200).json({
                    itemName: req.body.itemName,
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

// 알약의 사진을 찍었을 때 Drug 테이블에 저장하는 알고리즘
// Drug 테이블은 count를 추가한다.
exports.saveDrug = async (req, res) => {
    const drug = await foundDrug(req, res);
    models.Mydrug
        .findOne({ where: { itemName: drug.itemName } })
        .then(result => {
            if (result) {
                models.Mydrug.update({
                    count: result.count + 1,
                }, {
                    where: { itemName: result.itemName }
                })
                res.status(201).json({
                    message: '작성 완료',
                })
            } else {
                drugInfo.drugByName(drug.itemName, async (error, info) => {
                    const newDrug = {
                        itemName: drug.itemName,
                        efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        count: 1,
                    }
                    models.Mydrug.create(newDrug)
                        .then(result => {
                            res.status(201).json({
                                message: '저장 완료 !',
                            })
                        })
                        .catch(error => {
                            res.status(500).json({
                                message: 'case 1: 내부 서버 오류 발생',
                            })
                        });
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'case 0: 내부 서버 오류 발생',
            })
        })
}

// 증상검색에서 my알약에 저장하기.
exports.save2mydrug = async (req, res) => {
    console.log('drug/save2mydrug 호출됨');
    models.Mydrug
        .findOne({ where: { itemName: req.body.itemName } })
        .then(result => {
            if (result) {
                models.Mydrug.update({
                    count: result.count + 1,
                }, {
                    where: { itemName: result.itemName }
                })
                res.status(201).json({
                    message: '작성 완료',
                })
            } else {
                DURInfo.DURInfoService(req.body.itemName, (error, info) => {
                    let name = info.slice(info.indexOf('<MIXTURE_ITEM_NAME>') + 19, info.indexOf('</MIXTURE_ITEM_NAME>'))
                    if (name.length > 30)
                        name = "";
                    const mydrug = {
                        itemName: req.body.itemName,
                        mixtureItemName: name,
                        user_id: 0, // 토큰에 user_id를 담는 법을 알아야 함.
                    };
                    models.Mydrug.create(mydrug)
                        .then(result => {
                            res.status(201).json({
                                message: 'my알약에 등록되었습니다.'
                            })
                        })
                        .catch(error => {
                            res.status(500).json({
                                message: 'error at drugController.save2mydrug'
                            })
                        })
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'case 0: 내부 서버 오류 발생',
            })
        })
}
exports.test = async (req, res) => {
    console.log(req.body.email);
    res.status(200).json({
        message: 'hello',
    })
}
// 복약관리 기능 제거하면서 사용할 필요 없어짐.
// exports.deleteMyDrug = (req, res) => {
//     console.log('등록한 약 삭제 호출');

//     models.Drug
//         .destroy({
//             where: {
//                 id: req.params.id,
//             }
//         })
//         .then((result) => {
//             res.status(200).json({
//                 message: '등록한 약 삭제에 성공했습니다.',
//                 result,
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: 'Something went wrong!',
//             })
//         })
// }

let foundDrug = function (req, res) {
    return new Promise((resolve, reject) => {
        const drug = models.DB_drug
            .findOne({
                where: {
                    printFront: req.body.print,
                    drugShape: req.body.shape,
                    colorClass1: req.body.color,
                },
            });
        if (drug)
            resolve(drug);
        else {
            res.status(401).json({
                message: '약 검색에 실패했습니다. 사진을 다시 찍어주세요.',
            });
        }
    });
}
