if( typeof phishnet_years == "undefined" ) {
	function phishnet_years(json) {
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	 	];
		el = document.getElementById('setlist');
		setString = '';
		last_month = 0; 
		used = []; 
		el.innerHTML = "<h3>Shows from "+json.data[0].showyear+"</h3>"
		for(i=0;i<json.data.length;i++) {
			var n = json.data[i];
			const split = n.showdate.split('-');
			xyear = split[0];
			xmonth = split[1];
			xday = split[2];
			if(last_month!=xmonth) {
				setString += "<br>";  
				mo = parseInt(xmonth)-1; 
				setString += "<b>"+monthNames[mo]+"</b>: "; 
				last_month = xmonth; 
			}
			if(typeof used[n.showdate] === 'undefined') {
				setString += "<a href='#!/"+n.showdate+"' onclick=\"load_showdate('"+n.showdate+"')\">"+xday+"</a> | "
				used[n.showdate] = 1; 
			}
		}
		el.innerHTML += setString;
	}
}
