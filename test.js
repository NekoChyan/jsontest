const response = await fetch('https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin', {
    method: 'POST',
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
});

const data = await response.json();
const sdata = JSON.stringify(data);
const token = sdata.substr(40,30);

const food = await fetch('https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "eid":"IEC120698",
  "device":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
 "token":token,
  "tp":2,
  "para":"<dt>2023/08/31</dt><rid>117446</rid>" })
}).then(response=> response.json())
.then(myJson=> console.log(JSON.stringify(myJson)));