function ExchangeProduct() {
	url: 'https://app.inventec.com/iservice/iServicePWA.asmx/doRouteBook'
   		headers: {
               		'Content-Type': 'application/json'
               	}
        body: JSON.stringify({
			eid: "IEC120698",
			token: "C9479D1051F34293AEE4B6BB246323",
			device: "<token>C9479D1051F34293AEE4B6BB246323</token>",
			para: "<dt>2023/09/01</dt><rid>11747</rid>",
			tp: 2
	})	
	
}