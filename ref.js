function Post_Data(){
	var GetToken{
		url:"https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin",
		headers:{
			"Accept": "application/json",
        	"Content-Type": "application/json",
		},
		body: JSON.stringify({ 
			"eid": "IEC120698",
			"pass": "$Melon7809",
			"device": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
			"co": "Google Inc.",
			"IsOnce": "",
			"version": "1.0.0"})
	  }
	}
	$httpClient.post(GetToken,function(error,response,data))
    {
        var token,data,sdata;
		data = response.data;
		sdata = JSON.stringify(data);
		token = sdata.substr(40,30);
		console.log(token);
    }
	var GetParams{
		url:"https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin",
		headers:{
			"Accept": "application/json",
        	"Content-Type": "application/json",
		},
		body:JSON.stringify({ "eid":"IEC120698",
		"device":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
	   "token":token,
		"tp":2,
		"para":"<dt>2023/08/31</dt><rid>117446</rid>" })
	  }
	}
	$httpClient.post(GetParams,function(error,response,data))
    {
        var StatusCode,ResponseHeaders;
        StatusCode = response.status;
        ResponseHeaders = response.headers;
        console.log(response);
        console.log(StatusCode);//400
        console.log(ResponseHeaders);//Object
        console.log(error);
        console.log(data);
        console.log(Json.parse(data));//if data is Json String
        //Loon支持使用Console.log输出调试信息
    }
}