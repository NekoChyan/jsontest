//Bark APP 通知推送Key
$.barkKey = '';

// 为通知准备的空数组
$.notifyMsg = [];

(async function() { // 立即运行的匿名异步函数
	await main();
});

async function main( ) { 
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