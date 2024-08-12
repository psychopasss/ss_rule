// console.log("head "+JSON.stringify($response.headers));
$request.headers["Access-Control-Allow-Origin"] = "*";
$request.headers["Access-Control-Allow-Headers"] = "*";
$request.headers["Access-Control-Allow-Method"] = "*";
$request.headers["Access-Control-Allow-Credentials"] = "true";
// console.log("head2 "+JSON.stringify($response.headers));
if ($request.url.indexOf('mb3admin.com/admin/service/registration/validateDevice') != -1) {
    console.log("Emby Premiere Unlocked.");
    // $notification.post("Done", "Success", "Emby Premiere Unlocked.");
    $done({
        status: 200,
        headers: $response.headers,
        body: '{"cacheExpirationDays":365,"resultCode":"GOOD","message":"Device Valid"}'
    })
} else if ($request.url.indexOf('mb3admin.com/admin/service/registration/getStatus') != -1) {
    $done({
        status: 200,
        headers: $response.headers,
        body: '{"deviceStatus":"0","planType":"Lifetime","subscriptions":{}}'
    })
} else if ($request.url.indexOf('mb3admin.com/admin/service/registration/validate') != -1) {
    $done({
        status: 200,
        headers: $response.headers,
        body: '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}'
    })
} else {
    $done({})
}
