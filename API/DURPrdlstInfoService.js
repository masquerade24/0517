const request = require('request');
const x2j = require('xml-js');

exports.DURInfoService = (itemName, callback) => {
    const url = 'http://apis.data.go.kr/1470000/DURPrdlstInfoService/getUsjntTabooInfoList?';

    const ServiceKey = process.env.PORTAL_KEY;

    let queryParams = encodeURIComponent('serviceKey') + '=' + ServiceKey;
    queryParams += '&' + encodeURIComponent('typeName') + '=' + encodeURIComponent('병용금기');
    queryParams += '&' + encodeURIComponent('itemName') + '=' + encodeURIComponent(itemName);
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1');

    const fullurl = url + queryParams;

    request(fullurl, (error, result) => {
        const info = result.body;
        callback(null, info);
    });
}