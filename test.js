//Bark APP 通知推送Key
$.barkKey = '';

// 为通知准备的空数组
$.notifyMsg = [];

(async function() { // 立即运行的匿名异步函数
	await main();
})().catch((e) => $.notifyMsg.push(e.message || e)) //捕获登录函数等抛出的异常, 并把原因添加到全局变量(通知)
	.finally(async () => { //finally在catch之后无论有无异常都会执行
		if ($.barkKey) { //如果已填写Bark Key
			await BarkNotify($, $.barkKey, $.name, $.notifyMsg.join('\n')); //推送Bark通知
		};
		$.msg($.name, ``, $.notifyMsg.join('\n'), {
			'open-url': '', 
			'media-url': ''
		}); 
		$.done(); //调用Surge、QX内部特有的函数, 用于退出脚本执行
	});

async function main( ) { //登录函数，拿到Set-Cookie

	//登录成功: {"success":true,"userid":"DGIE","nickname":"coco","gold":152769,"gp":0,"avatar":"https:\/\/avatar2.bahamut.com.tw\/avataruserpic\/dgie.png","avatar_s":"https:\/\/avatar2.bahamut.com.tw\/avataruserpic\/dgie_s.png","lv":6}
	//账号错误: {"code":0,"message":"查無此人：SDFOUGB"}
	//密码错误: {"code":0,"message":"帳號、密碼或驗證碼錯誤！"}
	//验证码错误: {"code":0,"message":"驗證碼錯誤"}
    const reqUrl = {
        url: 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook', //登录接口
        headers: { //请求头
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "eid":"IEC120698",
        "device":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
       "token":"E39D7E0C12A0463CAABF98B1E2834E",
        "tp":2,
        "para":"<dt>2023/09/01</dt><rid>117476</rid>" })
    };
    await $.http.post(reqUrl) //使用post请求查询 (兼容函数实际上返回Promise实例对象,以便后续调用时可以实现顺序执行异步函数)
        .then(async (resp) => { //请求成功的处理
            const json = JSON.parse(resp.json); //解析响应体json为对象
            console.log(JSON.stringify(json));
        });
}


//Bark APP notify
async function BarkNotify(c,k,t,b){for(let i=0;i<3;i++){console.log(`🔷Bark notify >> Start push (${i+1})`);const s=await new Promise((n)=>{c.post({url:'https://api.day.app/push',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:t,body:b,device_key:k,ext_params:{group:t}})},(e,r,d)=>r&&r.status==200?n(1):n(d||e))});if(s===1){console.log('✅Push success!');break}else{console.log(`❌Push failed! >> ${s.message||s}`)}}};