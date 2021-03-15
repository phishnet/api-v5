if( typeof phishnet_venues == "undefined" ) {
	function phishnet_venues(json) {
		if(typeof json.data[0] === 'undefined') {
			return; 
		}
		el = document.getElementById('setlist');
		while(el.firstChild)
		  el.removeChild(el.firstChild);
		setString = "<h3>"+window.etpTitle+" &mdash; Every Time Played</h3>";
		setString += "<table class='table'><thead><tr><td>Show Date</td><td>Artist</td><td>Venue</td><td>City</td><td>State</td></tr></thead></tbody>";
		for(i=0;i<json.data.length;i++) {
			var n = json.data[i];
			setString += "<tr><td><a href='#!/"+n.showdate+"' ";
			setString += "onclick=\"load_showdate('"+n.showdate+"')\">"+n.showdate+"</a></td><td>"+n.artist_name+"</td><td><a href=\"#!/location="+n.venueid+"\" onclick=\"load_location('venueid','"+n.venueid+"','"+n.venue.replace(/\'/g, "\\\'")+"')\">"+n.venue+"</a></td><td><a href=\"#!/city\" onclick=\"load_location('city','"+n.city.replace(/\'/g, "\\\'")+"','"+n.city.replace(/\'/g, "\\\'")+"')\">"+n.city+"</a></td><td><a href=\"#!/state\" onclick=\"load_location('state','"+n.state+"','"+n.state+"')\">"+n.state+"</a></td>"
			setString += "</tr>" 
		}
		el.innerHTML += setString + "</tbody></table>"
	}
}