const currentDate = new Date();
const newDate = new Date(currentDate);
const value = $persistentStore.read('value');
const token = $persistentStore.read('token');
const valuearray = value.split(`\t`);
let add = 2;
if (currentDate.getDay() === 4 || currentDate.getDay() === 5) {
  add = 4;
};
newDate.setDate(currentDate.getDate() + add);
const formatted = `${newDate.getFullYear()}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getDate().toString().padStart(2, '0')}`;
const furl = 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook';
const device = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
const eid = 'IEC120698';
const request = {
  url: furl,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': device,
    'X-Requested-With': 'XMLHttpRequest',
  },
  body: {
    'eid': eid,
    'device': device,
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
      console.log(objd);
      $done();
    }
  }
});