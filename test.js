(function() {
    var request = new XMLHttpRequest();
    
    request.open('POST', 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook', true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    var requestData = {
        eid: "IEC120698",
        token: "C9479D1051F34293AEE4B6BB246323",
        device: "<token>C9479D1051F34293AEE4B6BB246323</token>",
        para: "<dt>2023/09/01</dt><rid>11747</rid>",
        tp: 2
    };
    
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var responseData = JSON.parse(request.responseText);
                console.log(responseData); // 可以更改成你想要處理回傳資料的程式碼
            } else {
                console.error('Error:', request.status, request.statusText);
            }
        }
    };
    
    request.send(JSON.stringify(requestData));
})();
