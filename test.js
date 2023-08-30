(function() {
    fetch('https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eid: "IEC120698",
            token: "C9479D1051F34293AEE4B6BB246323",
            device: "<token>C9479D1051F34293AEE4B6BB246323</token>",
            para: "<dt>2023/09/01</dt><rid>11747</rid>",
            tp: 2
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // 可以更改成你想要處理回傳資料的程式碼
    })
    .catch(error => {
        console.error('Error:', error);
    });
})();
