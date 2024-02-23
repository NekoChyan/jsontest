const url = 'https://app.inventec.com/iservice/iServicePWA.asmx/UserLogin';
const header = 'application/json';
const device = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
const eid = 'IEC120698';
const pwd = $persistentStore.read('pwd');

function Notify(subtitle = '', message = '') {
  $notification.post('GetToken', subtitle, message);
};

async function gettoken() {
  return new Promise((resolve, reject) => {
    const request = {
      url: url,
      headers: {
        'Accept': header,
        'Content-Type': header,
      },
      body: {
        'eid': eid,
        'device': device,
        'co': 'Google Inc.',
        'IsOnce': '',
        'version': '1.0.0',
        'pass': pwd
      }
    };
    $httpClient.post(request, function (error, response, data) {
      const jsondata = JSON.parse(data);
      const darray = JSON.parse(jsondata.d);
      const retvalue = darray[0].Ret;
      $persistentStore.write(retvalue, "token");
      return resolve();
    });
  });
}
(async () => {
  try {
    await gettoken();
    const l_token = $persistentStore.read('token');
    Notify(
      `Value`,
      `${l_token}`
    );
  } catch (error) {
    console.error('Error:', error);
  }
  $done({});
})();
$done()