/*
哔哩哔哩漫画, 积分商城自动抢购脚本

脚本兼容: Surge, QuantumultX, Loon

*************************
【 抢购脚本注意事项 】:
*************************

该脚本需要使用签到脚本获取Cookie后方可使用.
默认兑换积分商城中的"积分兑换", 兑换数量为用户积分可兑换的最大值 (可于BoxJs内修改)
默认执行时间为中午12:00:10、12:00:20、12:00:30

BoxJs订阅地址: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

*************************
【 Surge & Loon 脚本配置 】:
*************************

[Script]
cron "10,20,30 0 12 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/ExchangePoints.js, wake-system=1, timeout=60

*************************
【 QX 1.0.10+ 脚本配置 】 :
*************************

[task_local]
10,20,30 0 12 * * * https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/ExchangePoints.js, tag=哔哩哔哩漫画抢券, enabled=true

*/

// 新建一个实例对象, 把兼容函数定义到$中, 以便统一调用
let $ = new nobyda();

// 读取兑换商品名, 默认兑换积分商城中的"积分兑换"; 该接口为BoxJs预留, 以便修改
let productName = $.read('BM_ProductName') || '积分兑换';

// 读取兑换数量, 默认兑换最大值; 该接口为BoxJs预留, 以便修改
let productNum = $.read('BM_ProductNum');

// 读取循环抢购次数, 默认100次; 该接口为BoxJs预留, 以便修改
let exchangeNum = $.read('BM_ExchangeNum') || '100';

const body = { 
    'eid': 'IEC120698',
    'pass': '$Melon7809',
    'device': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'co': 'Google Inc.',
    'IsOnce': '',
    'version': '1.0.0'};
// 预留的空对象, 便于函数之间读取数据
let user = {};

(async function() { // 立即运行的匿名异步函数
	await ExchangeProduct(); //上面的查询都完成后, 则执行抢购
	$.done(); //抢购完成后调用Surge、QX内部特有的函数, 用于退出脚本执行
})();

function ExchangeProduct() {
	return new Promise(async (resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数, 该实例函数带有async关键字, 表示里面有异步操作, 例如可使用await得到异步结果
		
			const exchangeUrl = {
				url: 'https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin', //兑换商品接口
				headers: { //请求头
					'Content-Type': 'application/json', //声明请求体数据格式
					'Accept': 'application/json'
				},
				body: JSON.stringify({body})
			};
		resolve(); //将主函数的Promise对象状态标记为"成功", 表示已完成抢购任务
	})
}

function startExchange(url, item, amount) {
	return new Promise((resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数
		$.post(url, (error, resp, data) => { //使用post请求查询, 再使用回调函数处理返回的结果
			try { //使用try方法捕获可能出现的代码异常
				if (error) {
					throw new Error(error); //如果请求失败, 例如无法联网, 则抛出一个异常
				} else {
					const body = JSON.parse(data); //解析响应体json并转化为对象
					if (body.code == 0) { //如果抢购成功, 则输出日志和通知
						console.log(`\n抢购成功: 第${item+1}次\n抢购数量: ${amount}\n消耗积分: ${amount * user.list.real_cost}`);
						$.notify('哔哩哔哩漫画抢券', '', `"${productName}"抢购成功, 数量: ${amount}, 消耗积分: ${amount * user.list.real_cost}`);
						resolve(true); //将Promise对象的状态标记为"成功", 然后返回一个布尔值true用于跳出循环
					} else {
						throw new Error(body.msg || '未知'); //抢购失败则抛出异常
					}
				}
			} catch (e) { //接住try代码块中抛出的异常并打印日志
				console.log(`\n抢购失败: 第${item+1}次\n失败原因: ${e.message}`);
				resolve(); //将Promise对象的状态标记为"成功", 但不返回任何值, 表示继续循环抢购
			}
		})
	})
}

function nobyda() {
	const isSurge = typeof $httpClient != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isNode = typeof require == "function";
	const node = (() => {
		if (isNode) {
			const request = require('request');
			return {
				request
			}
		} else {
			return null;
		}
	})()
	const adapterStatus = (response) => {
		if (response) {
			if (response.status) {
				response["statusCode"] = response.status
			} else if (response.statusCode) {
				response["status"] = response.statusCode
			}
		}
		return response
	}
	this.read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key)
		if (isSurge) return $persistentStore.read(key)
	}
	this.notify = (title, subtitle, message) => {
		if (isQuanX) $notify(title, subtitle, message)
		if (isSurge) $notification.post(title, subtitle, message)
		if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
	}
	this.post = (options, callback) => {
		options.headers['User-Agent'] = 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/609.3.5.0.1 (KHTML, like Gecko) Mobile/17G80 BiliApp/822 mobi_app/ios_comic channel/AppStore BiliComic/822'
		if (isQuanX) {
			if (typeof options == "string") options = {
				url: options
			}
			options["method"] = "POST"
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			options.headers['X-Surge-Skip-Scripting'] = false
			$httpClient.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
		if (isNode) {
			node.request.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	this.done = () => {
		if (isQuanX || isSurge) {
			$done()
		}
	}
};