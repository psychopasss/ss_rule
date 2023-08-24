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
			if (!requestBody) {
				let pageCode = requestBody.pagecode
				if (pageCode == 'launch') {
					return 'clearLaunch';
				} else if (pageCode == 'home') {
					return 'clearHome';
				}
			}
		}
	}
	return null;
}
function removeTopics(data) {
	if (!data.data) {
		return data;
	}
	//if(data.data.search_topic) {delete data.data.search_topic;}
	if (data.data.topics) { delete data.data.topics; }
	if (data.data.discover) { delete data.data.discover; }

	return data;
}
function isAd(data) {
	if (!data) {
		return false;
	}
	if (data.mblogtypename == '广告' || data.mblogtypename == '热推') { return true };
	if (data.mblogtypename == '廣告' || data.mblogtypename == '熱推') { return true };
	if (data.promotion && data.promotion.type == 'ad') { return true };
	return false;
}

function isBlock(data) {
	let blockIds = mainConfig.blockIds || [];
	if (blockIds.length === 0) {
		return false;
	}
	let uid = data.user.id;
	for (const blockId of blockIds) {
		if (blockId == uid) {
			return true;
		}
	}
	return false;
}

function clearHome(data) {
	if (!data.data) {
		return data;
	}
	//删除惠民汇金、本地生活栏目
	data.pageconfig = data.pageconfig.filter(function (item) {
		for (const pagecode of removePagecode) {
			if (item.pagecode == pagecode) {
				return false;
			}
		}
		return true;
	});

	//删除扫一扫下面的广告位
	for (const tempStand of data.stands) {
		if (tempStand.standcode == 1016 || tempStand.standcode == 1007 || tempStand.standcode == 1005 || tempStand.standcode == 1001 || tempStand.standcode == 1002 || tempStand.standcode == 1029) {
			tempStand.substands = [];
		}
	}
}

function clearLaunch() {
	$done({ status: '404' });
}

var body = $response.body;
var url = $request.url;
var requestBody = $request.body;
let method = getModifyMethod(url, requestBody);
if (method) {
	var func = eval(method);
	let data = JSON.parse(body);
	new func(data);
	body = JSON.stringify(data);
}
$done({ body });
