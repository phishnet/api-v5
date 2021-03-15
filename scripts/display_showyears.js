if( typeof phishnet_year_nav == "undefined" ) {
	function phishnet_year_nav(json) {
		el = document.getElementById('pnet_nav');
		setString = '';
		used = []; 
		el.innerHTML = "<b>Select a Year: </b>"; 
		for(i=0;i<json.data.length;i++) {
			n = json.data[i]; 
			if(typeof used[n.showyear] === 'undefined') {
				setString += "<a href='#!/"+n.showyear+"' onclick=\"load_year('"+n.showyear+"')\">"+n.showyear+"</a> | "
				used[n.showyear] = 1; 
			}
		}
		el.innerHTML += setString;
	}
}