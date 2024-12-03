function FindProxyForURL(url, host) {
	var myIP = myIpAddress();
	var hostIP = dnsResolve(host);
	
	if (
			isPlainHostName(host) ||
			isInNet(hostIP, "127.0.0.0", "255.0.0.0")||
			isInNet(hostIP, "10.0.0.0", "255.0.0.0")||
			isInNet(hostIP, "172.16.0.0", "255.240.0.0")||
			isInNet(hostIP, "192.168.0.0", "255.255.0.0")||
			isInNet(hostIP, "20.102.78.199", "255.255.255.255")||
			dnsDomainIs(host, ".inventec.net")||
			dnsDomainIs(host, ".inventec.com.cn")||
			dnsDomainIs(host, ".inventec.com")||
			shExpMatch(host, "*.inventec")||
			shExpMatch(host, "login.external.hp.com")
		)
		return "DIRECT";

	// Redirect to upstreams server (FET) Teams, Skype for Business
	else if 
		(
			shExpMatch(host, "*.lync.com")||
			shExpMatch(host, "*.teams.microsoft.com")||
			shExpMatch(host, "teams.microsoft.com")||
			shExpMatch(host, "*.broadcast.skype.com")||
			shExpMatch(host, "broadcast.skype.com")||
			shExpMatch(host, "quicktips.skypeforbusiness.com")||
			shExpMatch(host, "*.sfbassets.com")||
			shExpMatch(host, "*.urlp.sfbassets.com")||
			shExpMatch(host, "skypemaprdsitus.trafficmanager.net")||
			shExpMatch(host, "*.keydelivery.mediaservices.windows.net")||
			shExpMatch(host, "*.msecnd.net")||
			shExpMatch(host, "*.streaming.mediaservices.windows.net")||
			shExpMatch(host, "ajax.aspnetcdn.com")||
			shExpMatch(host, "mlccdn.blob.core.windows.net")||
			shExpMatch(host, "download.windowsupdate.com")||
			shExpMatch(host, "aka.ms")||
			shExpMatch(host, "amp.azure.net")||
			shExpMatch(host, "*.whatismyip.com.tw")||
			shExpMatch(host, "*.users.storage.live.com")||
			shExpMatch(host, "*.adl.windows.com")||
			shExpMatch(host, "*.skypeforbusiness.com")||
			shExpMatch(host, "*.msedge.net")||
			shExpMatch(host, "compass-ssl.microsoft.com")||
			shExpMatch(host, "*.mstea.ms")||
			shExpMatch(host, "*.secure.skypeassets.com")||
			shExpMatch(host, "mlccdnprod.azureedge.net")||
			shExpMatch(host, "videoplayercdn.osi.office.net")||
			shExpMatch(host, "*.tenor.com")||
			shExpMatch(host, "*.skype.com")||
			shExpMatch(host, "*.eastus.cloudapp.azure.com")||
			shExpMatch(host, "statics.teams.cdn.office.net")||
			shExpMatch(host, "statics.teams.microsoft.com")||
			isInNet(hostIP, "13.107.64.0", "255.255.192.0")||
			isInNet(hostIP, "52.112.0.0", "255.252.0.0")|| 
			isInNet(hostIP, "52.120.0.0", "255.252.0.0")||   
			isInNet(hostIP, "52.238.119.141", "255.255.255.255")||  
			isInNet(hostIP, "52.244.160.207", "255.255.255.255")
		)
		return "PROXY 103.125.235.18:7770;";
	
	// Redirect to upstreams server (TAIFO) Office 365 outlook
	// Note: will redirect to proxy.iec.inventec once fail
	else if 
		(
			shExpMatch(host, "outlook.office.com")||
			shExpMatch(host, "outlook.office365.com")||
			shExpMatch(host, "*.outlook.office.com")||
			shExpMatch(host, "*.outlook.office365.com")||
			shExpMatch(host, "*.res.office365.com")||
			shExpMatch(host, "*.outlook.com")||
			shExpMatch(host, "*.attachments.office.net")||
			shExpMatch(host, "*.protection.outlook.com")||
			shExpMatch(host, "*.measure.office.com")||
			shExpMatch(host, "activation.sls.microsoft.com")||
			shExpMatch(host, "officeapps.live.com")||
			shExpMatch(host, "officecdn.microsoft.com")||
			shExpMatch(host, "go.microsoft.com")||
			shExpMatch(host, "office15client.microsoft.com")||
			shExpMatch(host, "sls.microsoft.com")
		)
		return "PROXY 103.125.235.18:7770;";

	// Some Large bandwidth consuming websites (TAIFO)
		
	// Redirect to upstreams server (FET) Yahoo, FB, Youtube, netflix
	else if 
		(
			shExpMatch(host, "*.yahoo.com")||
			shExpMatch(host, "*.yahoo.net")||
			shExpMatch(host, "*.yimg.com")||
			shExpMatch(host, "*.nflxvideo.net")||
			shExpMatch(host, "*.facebook.com")||
			shExpMatch(host, "*.fbcdn.net")||
			shExpMatch(host, "youtube.com")||
			shExpMatch(host, "*.youtube.com")||
			shExpMatch(host, "*youtu.be")||
			shExpMatch(host, "*.courses.nvidia.com")
		)
		return "DIRECT";

	// for special case 
	// MS PowerVirtual Agent, TOEIC
	else if 
		(
			shExpMatch(host, "directline.botframework.com")||
			isInNet(hostIP, "61.64.51.248", "255.255.255.255")      
		)
		return "PROXY 10.1.1.205:3128;PROXY 10.1.1.215:3128;DIRECT;";

	else if 
		(
			isInNet(myIP, "10.15.16.0", "255.255.248.0")||
			isInNet(myIP, "10.15.24.0", "255.255.248.0")
		)
		return "PROXY 10.1.1.215:3129;PROXY 10.1.1.205:3129;DIRECT;";

	else if 
		(
			isInNet(myIP, "10.15.64.0", "255.255.248.0")
		)
		return "PROXY 10.1.1.215:3129;PROXY 10.1.1.205:3129;DIRECT;";

	else if 
		(
			isInNet(myIP, "10.8.8.0", "255.255.248.0")||
			isInNet(myIP, "10.8.16.0", "255.255.248.0")||
			isInNet(myIP, "10.8.24.0", "255.255.248.0")||
			isInNet(myIP, "10.8.33.0", "255.255.255.0")
		)
		return "PROXY 10.1.1.205:3129;PROXY 10.1.1.215:3129;DIRECT;";

	else if 
		(
			isInNet(myIP, "10.8.80.0", "255.255.248.0")||
			isInNet(myIP, "10.8.88.0", "255.255.248.0")
		)
		return "PROXY 10.1.1.205:3129;PROXY 10.1.1.215:3129;DIRECT;";

	// Server Farm (APTG) Server IP
	else if 
		(
			isInNet(myIP, "10.1.0.0", "255.255.0.0")||
			isInNet(myIP, "10.8.100.0", "255.255.255.0")||
			isInNet(myIP, "10.15.1.0", "255.255.255.0")||
			isInNet(myIP, "10.15.2.0", "255.255.255.0")||
			isInNet(myIP, "10.15.3.0", "255.255.255.0")||
			isInNet(myIP, "10.15.4.0", "255.255.255.0")
		)
		return "PROXY 10.1.1.205:3129;PROXY 10.1.1.215:3129;DIRECT;";
	
	// IET ABC Building (APTG) Client IP 
	else if 
		(
			isInNet(myIP, "10.8.0.0", "255.255.0.0")
		)
		return "PROXY 10.1.1.205:3129;PROXY 10.1.1.215:3129;DIRECT;";
	
	// IET D Building (APTG) Client IP
	else if 
		(
			isInNet(myIP, "10.15.0.0", "255.255.0.0")
		)
		return "PROXY 10.1.1.215:3129;PROXY 10.1.1.205:3129;DIRECT;";

	// AIM @ ITO Client IP
	else if 
		(
			isInNet(myIP, "10.6.162.0", "255.255.255.0")
		)
		return "PROXY 10.6.254.210:3129;";
		
	else
    return "PROXY 103.125.235.18:7770;";
}
