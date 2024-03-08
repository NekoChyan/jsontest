let currentDate = new Date();
let newDate = new Date(currentDate);
let value = $persistentStore.read('value');
let token = $persistentStore.read('token');
let valuearray = value.split(`\t`);
let add = 2;
if (currentDate.getDay() === 4 || currentDate.getDay() === 5) {
  add = 4;
};
newDate.setDate(currentDate.getDate() + add);
let formatted = `${newDate.getFullYear()}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getDate().toString().padStart(2, '0')}`;
let request = {
  url: 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
  },
  body: {
    'eid': 'IEC120698',
    'device': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'token': token,
    'tp': 2,
    'para': `<dt>${formatted}</dt><rid>${valuearray[currentDate.getDay() - 1]}</rid>`,
  }
};


$httpClient.post(request, function (error, response, data) {
  if (error) {
    $notification.post(`訂餐${formatted}`, "", "連線錯誤‼️");
    console.log(response);
    $done();
  }
  else {
    if (response.status == 200) {
      let obj = JSON.parse(data);
      let objd = JSON.parse(obj.d);
      $notification.post(`訂餐${formatted}`, "", data);
      console.log(objd);
      $done();
    }
  }
});