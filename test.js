const response = await fetch('https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "eid":"IEC120698",
  "device":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
 "token":"E39D7E0C12A0463CAABF98B1E2834E",
  "tp":2,
  "para":"<dt>2023/09/01</dt><rid>117476</rid>" })
});

const json = await response.json();
console.log(JSON.stringify(json));