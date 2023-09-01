let showNotification = true;

// function surgeNotify(subtitle = '', message = '') {
//   $notification.post('Inventec token', subtitle, message, { 'url': '' });
// };

// function handleError(error) {
//   if (Array.isArray(error)) {
//     console.log(`❌ ${error[0]} ${error[1]}`);
//     if (showNotification) {
//       surgeNotify(error[0], error[1]);
//     }
//   } else {
//     console.log(`❌ ${error}`);
//     if (showNotification) {
//       surgeNotify(error);
//     }
//   }
// }

// function isManualRun(checkRequest = false, checkResponse = false) {
//   if (checkRequest) {
//     return !$request || ($request.body && JSON.parse($request.body).foo === 'bar');
//   }
//   if (checkResponse) {
//     return !$response || ($response.body && JSON.parse($response.body).foo === 'bar');
//   }
//   return false;
// }

async function getToken() {
  return new Promise((resolve, reject) => {
    try {
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
        console.log(bdata);
        return resolve();
      });
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}
