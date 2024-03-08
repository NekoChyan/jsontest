const pwd = $persistentStore.read('pwd');
const request = {
  url: 'https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: {
    'eid': 'IEC120698',
    'device': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'co': 'Google Inc.',
    'IsOnce': '',
    'version': '1.0.0',
    'pass': pwd
  }
};
$httpClient.post(request, function (error, response, data) {
  if (error) {
    $notification.post(`GetToken`, "", "連線錯誤‼️");
    console.log(response);
    $done();
  }
  else {
    if (response.status == 200) {
      let obj = JSON.parse(data);
      let objd = JSON.parse(obj.d);
      let retvalue = objd[0].Ret;
      $persistentStore.write(retvalue, "token");
      $notification.post(`GetToken`, "", `Value\n${retvalue}`);
      console.log(objd);
      $done();
    }
  }
});