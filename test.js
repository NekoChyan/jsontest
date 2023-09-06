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
        const obj = JSON.parse(data);
        console.log(JSON.stringify(obj));
    })
}
Post_Data()