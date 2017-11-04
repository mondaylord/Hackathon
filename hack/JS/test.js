var regURL = 'http://openapi.saicmotor.com/api/am/store/v0.12/applications/getAccessToken?' +
    'Authorize=Basic%20TzZ2WjZlbmNtNDphYzhkZTMyOC02ZmRlLTRiMzktOTdlMC05N2M4MTM2OTJkMWI=';
var contentType = 'application/json';
var regData;
$.ajax({
    async: false,
    type: 'get',
    contentType: contentType,
    url: regURL,
    success: function (data) {
        regData = data;
    }
});
var payload = {
    "name": "HappyGo",
    "contact": "1097501200@qq.com"
};
var orgdata;
$.ajax({
    async: false,
    url: 'https://openapi.saicmotor.com/opensaic/cloud/sms/v1.0.0/organization',
    beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + regData['accessToken']);
    },
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function (data) {
        console.log(data);
        orgdata = data;
        console.log(orgdata);
    }
});

var seed = Math.floor((Math.random() * 100));
var unlockSig = new String(seed + orgdata['data']['secret']);
var sig = MD5(unlockSig);
var templatePayload = {
    "content": "您好，尊敬的小屁眼子同学。恭喜您被我们选为了本届HACKxFDU比赛的三等奖获得者，我们将为您提供3,000元人民币的奖金，请您于下午17：30前到E1桌前领取。我们诚挚地期待您的到来。"
};
var templateData;
$.ajax({
    async: false,
    contentType: 'application/json',
    type: 'post',
    url: 'https://openapi.saicmotor.com/opensaic/cloud/sms/v1.0.0/organization/'
    + orgdata['data']['org_id'] + '/template',
    beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + regData['accessToken']);
        request.setRequestHeader("X-SMS-SEED", seed);
        request.setRequestHeader("X-SMS-SIGN", sig);
    },
    data: JSON.stringify(templatePayload),
    success: function (data) {
        console.log(data);
        templateData = data;
    }
});
var messagePayload = [{
    "content": "test",
    "dest_id": "18702103812",
    "market": false,
    "delivery_report": false,
    "template_id": templateData['data']['template_id'],
}];
$.ajax({
    async: false,
    url: 'https://openapi.saicmotor.com/opensaic/cloud/sms/v1.0.0/msg/' + orgdata['data']['org_id'],
    contentType: 'application/json',
    type: 'PUT',
    beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + regData['accessToken']);
        request.setRequestHeader("X-SMS-SEED", seed);
        request.setRequestHeader("X-SMS-SIGN", sig);
    },
    data: JSON.stringify(messagePayload),
    success: function (data) {
        console.log(data);
    }
})