function getToken(){
    const request = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "eid": "IEC120698",
            "pass": "$Melon7809",
            "device": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "co": "Google Inc.",
            "IsOnce": "",
            "version": "1.0.0"})
    };
    $httpClient.post(request, function(error,response,data){
        const bdata = $response.data;
        console.log(error);
        console.log(data);
        console.log(bdata);});
}