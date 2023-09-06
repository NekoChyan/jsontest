function Post_Data()
{
    var GetExampleParams
    {
        url:"https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin",
        headers:
        {
            "Accept":"application/json",
            "Content-Type":"application/json",
        },
        body: JSON.stringify({ 
            "eid": "IEC120698",
            "pass": "$Melon7809",
            "device": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "co": "Google Inc.",
            "IsOnce": "",
            "version": "1.0.0"})
    }
    $httpClient.post(GetExampleParams,function(error,response,data)
    {
        var StatusCode,ResponseHeaders;
        StatusCode = response.status;
        ResponseHeaders = response.headers;
        console.log(response);
        console.log(StatusCode);//400
        console.log(ResponseHeaders);//Object
        console.log(error);
        console.log(data);
        console.log(Json.stringify(data));//if data is Json String
        //Loon支持使用Console.log输出调试信息
    })
}
Post_Data()