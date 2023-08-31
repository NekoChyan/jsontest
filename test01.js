/************************

巴哈姆特签到脚本
包含主站签到、公会签到、动画疯答题等

脚本兼容: Surge、QuantumultX、Loon、Shadowrocket、Node.js
适配过程: https://nobyda.github.io/2021/07/24/Bahamut_daily_bonus_js_example
BoxJs订阅: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

*************************
【 签到脚本注意事项 】:
*************************

1. 该脚本需要进入BoxJs或脚本内填写账号密码后, 方可使用.
2. 不建议在凌晨执行,因需要获取动画疯题目答案; 默认配置将在每天的早上8:00执行.
3. 如需使用Node.js运行该脚本, 则需安装got、tough-cookie模块

*************************
【 Surge & Loon 脚本配置 】:
*************************

[Script]
cron "0 8 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bahamut/BahamutDailyBonus.js, wake-system=1, timeout=300

*************************
【 QX 1.0.10+ 脚本配置 】 :
*************************

[task_local]
0 8 * * * https://raw.githubusercontent.com/NobyDa/Script/master/Bahamut/BahamutDailyBonus.js, tag=巴哈姆特签到, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/bahamutGame.png

************************/

// 以下全局变量中的持久化接口为BoxJs预留, 以便修改
// 把兼容函数定义到$中, 以便统一调用
const $ = new Env('巴哈姆特');

// 用户名
$.uid = $.getdata('@ND_BAHA.ID') || 'YourUserName';

// 用户密码
$.pwd = $.getdata('@ND_BAHA.PW') || 'YourUserPassword';

// 两步验证Token, 16位数, 未设置请保持默认
$.totp = $.getdata('@ND_BAHA.TOTP') || '';

// 是否开启广告签到，true/false，默认关闭 (该功能耗时过长)
$.needSignAds = $.getdata('@ND_BAHA.ADS') || false;

// 是否自动签到公会，true/false，默认开启
$.needSignGuild = $.getdata('@ND_BAHA.GUILD') || true;

// 是否自动答题动画疯，true/false，默认开启 (不保证100%答题正确)
$.needAnswer = $.getdata('@ND_BAHA.ANSWER') || true;

//Bark APP 通知推送Key
$.barkKey = '';

// 为通知准备的空数组
$.notifyMsg = [];

(async function() { // 立即运行的匿名异步函数
	await BahamutLogin(); // 登录
	await BahamutGuildSign(); //签到巴哈公会
	await BahamutSign(); //签到巴哈
	await BahamutAnswer(); //动画疯答题
})().catch((e) => $.notifyMsg.push(e.message || e)) //捕获登录函数等抛出的异常, 并把原因添加到全局变量(通知)
	.finally(async () => { //finally在catch之后无论有无异常都会执行
		if ($.barkKey) { //如果已填写Bark Key
			await BarkNotify($, $.barkKey, $.name, $.notifyMsg.join('\n')); //推送Bark通知
		};
		$.msg($.name, ``, $.notifyMsg.join('\n'), {
			'open-url': 'crazyanime://', //动画疯url scheme
			'media-url': 'https://cdn.jsdelivr.net/gh/NobyDa/mini@master/Color/bahamutClear.png' //通知图片
		}); //带上总结推送通知
		$.done(); //调用Surge、QX内部特有的函数, 用于退出脚本执行
	});

async function BahamutLogin(retry = 3, interval = 1000) { //登录函数，拿到Set-Cookie

	//登录成功: {"success":true,"userid":"DGIE","nickname":"coco","gold":152769,"gp":0,"avatar":"https:\/\/avatar2.bahamut.com.tw\/avataruserpic\/dgie.png","avatar_s":"https:\/\/avatar2.bahamut.com.tw\/avataruserpic\/dgie_s.png","lv":6}
	//账号错误: {"code":0,"message":"查無此人：SDFOUGB"}
	//密码错误: {"code":0,"message":"帳號、密碼或驗證碼錯誤！"}
	//验证码错误: {"code":0,"message":"驗證碼錯誤"}

	for (let i = 0; i < retry; i++) { //循环登录(默认三次)
		if (i > 0) {
			$.log('', `🔶尝试第${i+1}次登录...`);
			await $.wait(interval); //延迟一秒
		};
		const reqUrl = {
			url: 'https://api.gamer.com.tw/mobile_app/user/v3/do_login.php', //登录接口
			headers: { //请求头
				'Cookie': 'ckAPP_VCODE=6666' //Cookie中的ckAPP_VCODE为必须
			},
			//请求体放入用户名和密码，并把它uri编码
			body: `uid=${encodeURIComponent($.uid)}&passwd=${encodeURIComponent($.pwd)}&vcode=6666${$.totp?`&twoStepAuth=${TOTP($.totp)}`:``}`
		};
		const res = await $.http.post(reqUrl) //使用post请求查询 (兼容函数实际上返回Promise实例对象,以便后续调用时可以实现顺序执行异步函数)
			.then(async (resp) => { //请求成功的处理
				const body = JSON.parse(resp.body); //解析响应体json为对象
				if (body.userid) { //如果成功返回用户信息
					$.BAHARUNE = JSON.stringify(resp.headers).split(/(BAHARUNE=\w+)/)[1];
					return `✅巴哈姆特登录成功`;
				} else { //否则登录失败 (例如密码错误)
					const failMsg = body.error ? body.error.message : null; //判断签到失败原因
					throw new Error(`${body.message||failMsg||'原因未知'}`); //带上原因抛出异常
				}
			}).catch((err) => `❌登录失败\n❌${err.message || err}`);
		$.log('', res.message || res);
		if (res === `✅巴哈姆特登录成功`) {
			break; //登录成功则跳出循环
		} else if (retry == i + 1) { //如果最后一次重试仍登录失败
			throw new Error(res.message || res); //抛出错误, 被调用该函数时的catch捕获, 脚本结束.
		}
	}
}

function BahamutSign() { //查询巴哈姆特签到Token
	return $.http.get({ //使用get方法 (Promise实例对象) 查询签到Token
			url: 'https://www.gamer.com.tw/ajax/get_csrf_token.php', // 查询Token接口
			headers: {} //请求头, 客户端将自动设置Cookie字段
		}).then(async (resp) => { //网络请求成功的处理, 实例函数带有async关键字, 表示里面有异步操作
			if (resp.body) { //如果签到Token获取成功
				$.log('', '✅获取签到令牌成功'); //打印日志
				const sign = await StartSignBahamut(resp.body); //带上Token开始签到
				$.notifyMsg.push(`主页签到: 成功, 已连续签到${sign}天`); //添加到全局变量备用 (通知)
				await StartAdsBonus(resp.body.slice(0, 16), 'start'); //执行广告签到
			} else { //否则抛出异常
				throw new Error('获取签到令牌失败'); //带上原因被下面catch捕获
			}
		})
		.catch(err => {
			$.notifyMsg.push(`主页签到: ${err.message||err}`); //添加到全局变量备用 (通知)
			$.log('', `❌巴哈姆特签到失败`, `❌${err.message||err}`);
		}); // 捕获异常, 打印日志
}

function StartSignBahamut(token) { //巴哈姆特签到

	//签到成功: {"data":{"days":1,"dialog":"","prjSigninDays":0}}
	//已签过: {"error":{"code":0,"message":"今天您已經簽到過了喔","status":"","details":[]}}
	//未登录: {"error":{"code":401,"message":"尚未登入","status":"NO_LOGIN","details":[]}}
	//令牌过期: {"error":{"code":403,"message":"網頁已過期","status":"CSRF_TOKEN_ERROR","details":[]}}

	return $.http.post({ //使用post方法 (Promise实例对象) 进行签到
			url: 'https://www.gamer.com.tw/ajax/signin.php', //巴哈姆特签到接口
			headers: {}, //请求头, 客户端将自动设置Cookie字段
			body: `action=1&token=${token}` //请求体带上查询到的签到Token
		})
		.then(res => { // 网络请求成功的处理
			const body = JSON.parse(res.body); //解析响应体json为对象
			if (body.data) { // 如果签到成功 (判断预期响应格式)
				$.log('', '✅巴哈姆特签到成功', `✅已连续签到${body.data.days}天`); //打印日志
				return body.data.days; //返回签到天数
			} else { //否则签到失败
				const failMsg = body.error ? body.error.message : null; //判断签到失败原因
				throw new Error(failMsg || body.message || '未知'); //带上原因抛出异常
			}
		}); //未写catch，如果签到失败或其他错误，则被调用该函数时的catch捕获
}

function StartAdsBonus(token, type) {
	if ($.needSignAds === false || $.needSignAds === 'false') { //如果用户选择不签到广告
		return; //退出广告签到函数
	}
	return $.http.post({ //使用post方法 (Promise实例对象) 进行签到
			url: 'https://api.gamer.com.tw/mobile_app/bahamut/v1/sign_in_ad_' + type + '.php', //双倍巴币广告奖励接口
			headers: {
				'X-Bahamut-Csrf-Token': token, //前16位签到Token
				'Cookie': `ckBahamutCsrfToken=${token};${$.BAHARUNE}` //前16位签到Token和重新设置的Cookie
			}
		})
		.then(async (res) => { //网络请求成功的处理, 实例函数带有async关键字, 表示里面有异步操作
			const body = JSON.parse(res.body); //解析响应体json为对象
			if (body.data && body.data.finished == 0 && type == 'start') { //如果成功激活广告奖励
				$.log('', '🔶正在执行广告签到 (30s)'); //打印日志
				await $.wait(30000); //等待30秒
				await StartAdsBonus(token, 'finished'); //领取奖励函数
			} else if (body.data && body.data.finished == 1) { //如果广告奖励领取成功
				$.log('', '✅领取广告奖励成功'); //打印日志
				$.notifyMsg.push('广告签到: 成功, 已领取双倍签到奖励'); //添加到全局变量备用 (通知)
			} else {
				const failMsg = body.error ? body.error.message : null; //判断签到失败原因
				throw new Error(failMsg || body.message || '未知'); //带上原因抛出异常
			}
		})
		.catch(err => {
			$.notifyMsg.push(`广告签到: ${err.message||err}`); //添加到全局变量备用 (通知)
			$.log('', `❌广告奖励签到失败`, `❌${err.message||err}`);
		}); // 捕获异常, 打印日志
}

function BahamutGuildSign() { //巴哈姆特查询公会列表
	if ($.needSignGuild === false || $.needSignGuild === 'false') { //如果用户选择不签到公会
		return; //退出公会签到函数
	}
	return $.http.get({ //使用get请求查询公会列表 (Promise实例对象)
			url: 'https://api.gamer.com.tw/ajax/common/topBar.php?type=forum', // 查询公会列表接口
			headers: {} //请求头, 客户端将自动设置Cookie字段
		})
		.then(async (resp) => { //网络请求成功的处理, 实例函数带有async关键字, 表示里面有异步操作
			const list = (resp.body.replace(/\n/g, '').match(/guild\.php\?g?sn=\d.+?<\/p>/g) || []) //正则过滤公会列表大致内容
				.map(n => { //使用map遍历每个大致内容
					return { //返回包含公会ID和公会名称的对象
						sn: n.split(/guild\.php\?g?sn=(\d+)/)[1], //正则进一步提取公会ID
						name: n.split(/<p>(.+?)<\/p>/)[1] //正则进一步提取公会名称
					}
				});
			if (list.length) { //过滤后, 如果包含公会列表
				$.log('', `✅获取公会列表成功`); //打印日志
				//按照公会数量进行并发签到, map结合Promise.all后可以实现并发签到并且都完成后才进行下一行操作
				const sign = await Promise.all(list.map(StartSignGuild));
				const sucs = sign.filter(n => n === 1).length; //过滤后得到成功数量
				const fail = sign.filter(n => n === 0).length; //过滤后得到失败数量
				//添加到全局变量备用 (通知)
				$.notifyMsg.push(`公会签到: ${sucs?`成功${sucs}个`:``}${sucs&&fail?`, `:``}${fail?`失败${fail}个`:``}`);
			} else {
				throw new Error('公会列表为空'); //无公会列表则抛出异常
			}
		})
		.catch(err => { //捕获异常, 打印日志
			$.notifyMsg.push(`公会签到: ${err.message || err}`); //添加到全局变量备用 (通知)
			$.log('', `❌巴哈姆特公会签到失败`, `❌${err.message || err}`); //打印日志
		});
}

function StartSignGuild(v) { //巴哈姆特公会签到

	//签到成功: {"ok":1,"msg":"本日簽到成功！獲得5貢獻度"}
	//已签过: {"error":1,"msg":"您今天已經簽到過了！"}
	//公会ID错误: {"error":1,"msg":"此公會社團不存在。"}
	//未加入公会: {"error":1,"msg":"你還不是成員，歡迎加入！"}
	//未登录: {"error":1,"msg":"請先登入"}

	return $.http.post({ //使用post方法签到公会 (Promise实例对象)
			url: 'https://guild.gamer.com.tw/ajax/guildSign.php', //公会签到接口
			headers: {}, //请求头, 客户端将自动设置Cookie字段
			body: `sn=${v.sn}` //把查询到的公会ID放进请求体
		})
		.then((res) => { //网络请求成功后的处理
			const body = JSON.parse(res.body); //解析响应体json为对象
			$.log('', `🔷<${v.name}>`, `${body.ok?`✅`:`❌`}${body.msg}`); //打印日志, 包含签到结果
			if (body.ok) { //如果签到成功
				return 1; //返回1表示成功
			} else {
				return 0; //返回0表示失败
			}
		})
		.catch(e => { //捕获异常, 打印日志
			$.log('', `🔷<${v.name}>`, `❌签到失败: ${e.message||e}`);
			return 0; //返回0表示失败
		});
}

function BahamutAnswer() { //动画疯答题

	//未答题: {"game":"灌籃高手","question":"流川楓的號碼是下列何者？","a1":"7","a2":"11","a3":"23","a4":"59","userid":"GN32964174","token":"01092fe463ab36ab47cb298e229c4f8fb298e229cc260fa7baf"}
	//已答题: {"error":1,"msg":"今日已經答過題目了，一天僅限一次機會"}
	//未登录: {"error":1,"nologin":1,"msg":"請先登入"}

	if ($.needAnswer === false || $.needAnswer === 'false') { //如果用户关闭动画疯答题
		return; //退出答题函数
	}
	return $.http.get({ //使用get方获取题目 (Promise实例对象)
			url: 'https://ani.gamer.com.tw/ajax/animeGetQuestion.php?t=' + Date.now(), //获取题目接口
			headers: {} //请求头, 客户端将自动设置Cookie字段
		})
		.then(async (res) => { //网络请求成功的处理, 实例函数带有async关键字, 表示里面有异步操作
			const r = JSON.parse(res.body); //解析响应体json为对象
			if (r.token) { //如果有题目
				$.log('', `✅获取动画疯题目成功`, ``, `🔶<${r.game}> ${r.question}`,
					`1️⃣${r.a1}`, `2️⃣${r.a2}`, `3️⃣${r.a3}`, `4️⃣${r.a4}`); //打印日志
				const article = await GetAanswerArticles(); //获取答案文章ID
				const getAnswer = await StartSearchAnswers(article); //传入文章ID, 再从文章内获取答案
				const sendAnswer = await StartBahamutAnswer(getAnswer, r.token); //传入答案和题目令牌, 开始答题
				$.notifyMsg.push(`动画答题: ${sendAnswer}`); //答题后的结果添加到全局变量备用 (通知)
			} else { //未获取到题目
				throw new Error(r.msg || `获取题目失败`); //带上原因抛出异常
			}
		})
		.catch(e => { //捕获异常, 打印日志
			$.notifyMsg.push(`动画答题: ${e.message||e||`失败`}`); //添加到全局变量备用 (通知)
			$.log('', `❌动画疯答题失败`, `❌${e.message||e}`); //打印日志
		});
}

function GetAanswerArticles() { // 从blackxblue的小屋查询含答案的文章ID
	$.log('', `🔶开始获取文章`); //打印日志
	return $.http.get({ //使用get方法获取文章ID (Promise实例对象)
			url: 'https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=blackXblue&page=1', //获取文章ID接口
			headers: {}
		})
		.then((res) => { //网络请求成功后的处理
			const body = JSON.parse(res.body); //解析响应体json为对象
			const tDate = $.time('MM/dd'); //返回今日日期
			const title = (body.creation || []).filter(t => t.title.includes(tDate)); //过滤后返回今日答案文章
			if (title.length && title[0].sn) { //如果有答案文章
				$.log('', `✅获取文章成功 (${title[0].sn})`); //打印日志
				return title[0].sn; //返回文章ID
			} else { //否则带上原因抛出异常, 被调用该函数时的catch捕获
				throw new Error('今日答案未发表');
			}
		})
}

function StartSearchAnswers(id) { //获取文章内答案
	$.log('', `🔶开始获取答案`); //打印日志
	return $.http.get({ //使用get方法获取答案 (Promise实例对象)
			url: 'https://api.gamer.com.tw/mobile_app/bahamut/v1/home_creation_detail.php?sn=' + id, //获取答案接口
			headers: {}
		})
		.then((res) => { //网络请求成功后的处理
			const body = JSON.parse(res.body); //解析响应体json为对象
			const answers = body.content.split(/A:(\d)/)[1]; //正则提取答案
			if (answers) { //如果成功提取答案
				$.log('', `✅获取答案成功 (${answers})`); //打印日志
				return answers; //返回答案
			} else { //否则带上原因抛出异常, 被调用该函数时的catch捕获
				throw new Error('提取答案失败');
			}
		})
}

function StartBahamutAnswer(answer, token) { //动画疯答题

	//答题正确: {"ok":1,"gift":"恭喜您得到：300 巴幣"}
	//答题错误: {"error":1,"msg":"答題錯誤"}
	//令牌过期: {"error":1,"msg":"很抱歉！本題目已超過時效！"}
	//已答题: {"error":1,"msg":"今日已經答過題目了，一天僅限一次機會"}
	//未登录: {"error":1,"nologin":1,"msg":"請先登入"}

	$.log('', `🔶开始答题`); //打印日志
	return $.http.post({ //使用post方法提交答案 (Promise实例对象)
			url: 'https://ani.gamer.com.tw/ajax/animeAnsQuestion.php', //提交答案接口
			headers: {}, //请求头, 客户端将自动设置Cookie字段
			body: `token=${token}&ans=${answer}&t=${Date.now()}`, //请求体带上答案和答案令牌
		})
		.then((res) => { //网络请求成功后的处理
			const body = JSON.parse(res.body); //解析响应体json为对象
			if (body.ok) { //如果答题成功
				$.log('', `✅${body.gift}`); //打印奖励日志
				return body.gift; //返回奖励内容
			} else { //否则答题失败
				const failMsg = body.error ? body.error.message : null; //提取签到失败原因
				throw new Error(body.msg || failMsg || '未知'); //否则带上原因抛出异常, 被调用该函数时的catch捕获
			}
		})
}