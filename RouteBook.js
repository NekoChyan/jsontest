const currentDate = new Date();
const newDate = new Date(currentDate);
const value = $persistentStore.read('value');
const valuearray = value.split(`\t`);

let add = 2;
if(currentDate.getDay() === 4 || currentDate.getDay() === 5){
    add = 4;
};
newDate.setDate(currentDate.getDate()+add);
const formatted = `${newDate.getFullYear()}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getDate().toString().padStart(2, '0')}`;
const furl = 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook';
const device = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';
const eid = 'IEC120698';

function Notify(subtitle = '', message = '') {
  $notification.post('RouteBook', subtitle, message);
};

async function refood(token){
  return new Promise((resolve)=>{
    const request = {
      url: furl,
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent':device,
        'X-Requested-With':'XMLHttpRequest',
      },
      body:{
        'eid':eid,
        'device':device,
        'token': token,
        'tp':2,
        'para':`<dt>${formatted}</dt><rid>${valuearray[currentDate.getDay()-1]}</rid>`,
      }
    };
		for(var i = 1 ; i<=5 ; i++){
	    $httpClient.post(request,function (error, response, data){
				console.log(i);
				resolve(data);
	    });
		}
  })
}
(async () => {
  try{
    const token = $persistentStore.read('token');
    var msg = await refood(token);
    Notify(`訂餐資訊${formatted}`,`Value:${valuearray[currentDate.getDay()-1]}\n${msg}` );
  }catch(error){
    console.error('Error:', error);
  }
})();
$done()
