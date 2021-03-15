if( typeof phishnet_setlist == "undefined" ) {
	function phishnet_setlist(json) {
		last_set = 0;
		el = document.getElementById('setlist');
		setString = '';
		el.innerHTML = "<h3><a href='"
			+ json.data[0].permalink + "'>" + json.data[0].artist_name + " &mdash; "+json.data[0].showdate + " " + json.data[0].venue + ", "
			+ json.data[0].city + ", " + json.data[0].state + "</a></h3>"
		for(i=0;i<json.data.length;i++) {
			var n = json.data[i];
			if(last_set!=n.set) { 
				if(1!=n.set) { setString += "</p>"; }
				if(1==n.set || 2==n.set || 3==n.set || 4==n.set) { 
					setString +=	"<p><b>Set "+n.set+":</b> ";
				} else if('e3'==n.set) { 
					setString +=	"<p><b>Encore 3:</b> ";
				} else if('e2'==n.set) { 
					setString +=	"<p><b>Encore 2:</b> ";
				} else { 
					setString +=	"<p><b>Encore:</b> ";
				}
			}
			//# setString += " <a href='https://phish.net/song/"+ n.slug + "'"; 
			setString += " <a href='#!/"+n.slug+"' onclick=\"load_songlist('"+n.slug+"')\" ";
			if(1==n.isjamchart) { 
				setString += " style='color:#f00;' title='"+n.jamchart_description.replace(/\"/g, "&quot;").replace(/\'/g, "&apos;")+"'"; 
			} else { 
				setString += " title='"+n.song+"'"; 
			}
			setString += ">"+n.song+"</a>"; 
			setString += n.trans_mark;
			last_set = n.set;
		}
		el.innerHTML += setString + "</p>"
		if(n.setlistnotes.replace(/^\s+|\s+$/g,"")!='') { el.innerHTML += "<p class='pnetsn'>" + n.setlistnotes + "</p>"; }
	}
}
