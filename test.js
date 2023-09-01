const loginHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const loginBody = {
    eid: 'IEC120698',
    pass: '$Melon7809',
    device: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    co: 'Google Inc.',
    IsOnce: '',
    version: '1.0.0'
};

$httpClient.post({
    url: 'https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin',
    headers: loginHeaders,
    body: JSON.stringify(loginBody)
}, function(error, response, data) {
    if (error) {
        $done({ error: error });
    } else {
        const loginData = JSON.parse(data);
        const token = loginData.d.substring(40, 70);
        
        const bookHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        
        const bookBody = {
            eid: 'IEC120698',
            device: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            token: token,
            tp: 2,
            para: '<dt>2023/08/31</dt><rid>117446</rid>'
        };
        
        $httpClient.post({
            url: 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook',
            headers: bookHeaders,
            body: JSON.stringify(bookBody)
        }, function(error, response, data) {
            if (error) {
                $done({ error: error });
            } else {
                const bookData = JSON.parse(data);
                $done({ response: JSON.stringify(bookData) });
            }
        });
    }
});
