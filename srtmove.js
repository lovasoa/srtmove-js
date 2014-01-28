function log(msg) {
	var p=document.createElement("p");
	p.innerHTML = msg;
	document.getElementById("logs").appendChild(p);
}

var srtChoose = document.getElementById("srtchoose");
var negative = document.getElementById("negative");
var mn = document.getElementById("mn");
var s = document.getElementById("s");
var anchor = document.getElementById("download");

function onlynums (e) {if(e.target.value.match(/[^\d]/)) e.target.value="00";}
mn.addEventListener("change", onlynums, true);
s.addEventListener("change", onlynums, true);
mn.addEventListener("keyup", function(){
	if (mn.value.indexOf("-")==0) {
		mn.value = mn.value.slice(1);
		negative.checked = true;
	}
}, true);
function time2num (s) {
	var t=s.split(':');
	return t[0]*3600 + t[1]*60 + parseFloat(t[2].replace(",",'.'));
}

function num2time (n) {
	var s = ((n%60<10 ? '0' : '')+(n%60+1e-4)).slice(0,6).replace(".",',');
	var m = ("00" + ((n/60|0) % 60)).slice(-2);
	var h = ("00" + (n/3600|0)).slice(-2);
	return h+":"+m+":"+s
}

function srtmove () {
	file = srtChoose.files[0];
	if (!file) return;
	if (file.type.indexOf("subrip") == -1) log("ERROR: Invalid file type.");

	log("Loading subtitles");

	var r=new FileReader();
	r.onerror = function (e) {
		log("ERROR loading subtitles: "+e);
	};

	var t = Date.now();

	var addition = (negative.checked?-1:1) * (60*(mn.value|0) + (s.value|0));

	r.onload = function () {
		log("Subtitles loaded.");
		var subs = r.result.replace(/\r\n/g, "\n").split("\n\n");
		log(subs.length + " subtitles found");
		var subnum = 1;
		newSubFileLines = [];
		for (var i=0; i<subs.length; i++) {
			var sub = subs[i].split("\n");
			if (sub.length < 3) continue; //invalid sub
			var intline = sub[1].split(" ");
			var endintline = (intline.length==4) ? " "+intline[3] : "";
			var interval = [intline[0], intline[2]].map(time2num);
			var int = interval.map(function(n){return num2time(n+addition)});
			if (interval[0] > -addition && interval[1] > -addition) {
				newSubFileLines.push(
						subnum + "\r\n" +
						int[0] + " --> " + int[1] + endintline + "\r\n" +
						sub.slice(2).join("\r\n")
				);
				subnum++;
			}
		}
		log("Nouveaux sous-titres calculés en "+ (Date.now()-t) + "ms");
		anchor.download = file.name.replace(".srt", "-resynced.srt");
		anchor.href = "data:," + encodeURIComponent(newSubFileLines.join("\r\n\r\n"));
	};
	r.readAsText(file);
};
anchor.addEventListener("mousedown", srtmove, true);

