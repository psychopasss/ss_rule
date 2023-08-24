/*
 * 移除杭州市民卡广告脚本
 */
const mainConfig = {};

// https://taichu.96225.com/showcase/findPage
const modifyCardsUrls = ['/showcase/findPage'];
const removePagecode = ['TR3123', 'FR1238'];

function getModifyMethod(url, requestBody) {
	for (const s of modifyCardsUrls) {
		if (url.indexOf(s) > -1) {
			console.log('开始处理=' + s);
			console.log('requestBody=' + JSON.stringify(requestBody))
			if (requestBody) {
				let pageCode = requestBody.pagecode
				console.log('pageCode=' + pageCode);
				if (pageCode == 'launch') {
					return 'clearLaunch';
				} else if (pageCode == 'home' || pageCode == 'mine') {
					return 'clearHome';
				}
			}
		}
	}
	return null;
}

function clearHome(data) {
	if (!data.data) {
		return data;
	}
	//删除惠民汇金、本地生活栏目
	//删不掉, 程序默认写死了两个按钮
	//替换金融按钮链接为本地生活
	for (const item of data.data.pageconfig) {
		if (item.pagecode == 'TR3123') {
			item.linkUrl = 'https://zhenxuan.96225.com/skMallMobile/#/mall?approachNo=app';
		}
	}

	//删除扫一扫下面的广告位, 以及我的页面广告
	for (const tempStand of data.data.stands) {
		let standcode = tempStand.standcode;
		if (standcode == 1016 || standcode == 1007 || standcode == 1002) {
			tempStand.substands = [];
		}
		if (standcode == 1001 || standcode == 1005 || standcode == 1029) {
			tempStand.applys = [];
		}
		if (standcode == 1022) {
			tempStand.config = {}
		}
	}
}

function clearLaunch() {
	console.log('返回404');
	$done({ status: '404' });
}

var body = $response.body;
var url = $request.url;
var requestBody = $request.body;
if (requestBody) {
	requestBody = JSON.parse($request.body);
}

let method = getModifyMethod(url, requestBody);

if (method) {
	var func = eval(method);
	if (body) {
		let data = JSON.parse(body);
		new func(data);
		body = JSON.stringify(data);
	}
}

$done({ body: body });
