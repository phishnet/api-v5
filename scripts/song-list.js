if( typeof phishnet_songlist == "undefined" ) {
	function phishnet_songlist(json) {
		if(typeof json.data[0] === 'undefined') {
			return; 
		}
		el = document.getElementById('setlist');
		while(el.firstChild)
		  el.removeChild(el.firstChild);
		setString = "<h3><a href='https://phish.net/song/"
			+ json.data[0].slug + "'>" + json.data[0].nickname + "</a> &mdash; Every Time Played</h3>";
		setString += "<table class='table'><thead><tr><td>Show Date</td><td>Artist</td><td>Venue</td><td>Set Position</td><td>Gap</td></tr></thead></tbody>";
		for(i=0;i<json.data.length;i++) {
			var n = json.data[i];
			setString += "<tr><td><a href='#!/"+n.showdate+"' ";
			if(n.isjamchart==1) { 
				setString += " style='color:#f00;' title='"+n.jamchart_description.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;")+"'";
			}
			setString += "onclick=\"load_showdate('"+n.showdate+"')\">"+n.showdate+"</a></td><td>"+n.artist_name+"</td><td><a href=\"#!/venue-"+n.venueid+"\" onclick=\"load_location('venueid','"+n.venueid+"','"+n.venue.replace(/\'/g, "\\\'")+"')\">"+n.venue+"</a>, <a href=\"#\" onclick=\"load_location('city','"+n.city+"','"+n.city.replace(/\'/g, "\\\'")+"')\">"+n.city+"</a>, <a href=\"#\" onclick=\"load_location('state','"+n.state+"','"+n.state.replace(/\'/g, "\\\'")+"')\">"+n.state+"</a></td>"
			setString += "<td>"+n.position+"</td><td>"+n.gap+"</td></tr>" 
		}
		el.innerHTML += setString + "</tbody></table>"
	}
}