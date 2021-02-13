var socket = io.connect(); 
socket.emit('arrayrec', 'value')

let examcontent = document.getElementById("examcontent");
let titlecontent = document.getElementById("titlecontent");
let descriptioncontent = document.getElementById("descriptioncontent");
let viewfiles = document.getElementById("viewfiles");
let viewfilessolution = document.getElementById("viewfilessolution")
let viewfileswritten = document.getElementById("viewfileswritten");
openfile = [1, 1, 1];
var sourcepaperpdf = document.getElementById("sourcepaperpdf");
var sourcewritten = document.getElementById("sourcewritten");
var sourcesolutionpdf = document.getElementById("sourcesolutionpdf");
// var sessionstate = localStorage.getItem("searchstate");

socket.on('arrayrec', function(data) {
	console.log(data)
	examcontent.innerHTML = data[2];
	titlecontent.innerHTML = data[0];
	descriptioncontent.innerHTML = data[1];
	// console.log(sessionstate);

	viewfiles.onclick = function () {
		loadcontent(0, data[3])
	}
	viewfilessolution.onclick = function () {
		loadcontent(1, data[3])
	}
	viewfileswritten.onclick = function () {
		loadcontent(2, data[3])
	}
});

async function sessionstatefunc() {
	window.location.href = await '/database';
	event.preventDefault()
}

async function loadcontent(num, value) {
	var content1;
	var content2;
	var content3;
	switch (num) { 
		case 0: //loadpdf func
			if (openfile[num] == 1) {
				openfile[num] = 0;
				var data = await [value, 6];
				await socket.emit('loadcontent', data);
			   	await socket.on('loadcontent', function(data) {
			   		if (content1 == undefined) {
				   		content1 = data;
						var hr = document.createElement("hr");
						hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
						sourcepaperpdf.appendChild(hr)


						var iframeexam = document.createElement("iframe");
						iframeexam.id = "frameofquestion";
						iframeexam.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
						iframeexam.src = content1;	
						sourcepaperpdf.innerHTML = '';	   	
						sourcepaperpdf.appendChild(iframeexam)	
						console.log(content1);
						console.log(content2);
						console.log(content3);
			   		}
			    });
			} else if (openfile[num] == 0) {
				openfile[num] = 1;
				sourcepaperpdf.innerHTML = ' ';
				content1 = undefined;
			}
		break;

		case 1: //loadsolution func
			if (openfile[num] == 1) {
				openfile[num] = 0;
				var data = await [value, 7];
				await socket.emit('loadcontent', data);
			   	await socket.on('loadcontent', function(data) {
			   		if (content2 == undefined) {
				   		content2 = data;
						var hr = document.createElement("hr");
						hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
						sourcesolutionpdf.appendChild(hr)

						var iframesolution = document.createElement("iframe")
						iframesolution.id = "frameofquestion";
						iframesolution.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
						iframesolution.src = content2;

						sourcesolutionpdf.innerHTML = '';	
						sourcesolutionpdf.appendChild(iframesolution)
						console.log(content1);
						console.log(content2);
						console.log(content3);
					}
			   	});
			} else if (openfile[num] == 0) {
				openfile[num] = 1;
				sourcesolutionpdf.innerHTML = ' ';
				content2 = undefined;
			}
		break;

		case 2: //loadwrite func
			if (openfile[num] == 1) {
				openfile[num] = 0;
				var data = await [value, 8];
				await socket.emit('loadcontent', data);
			   	await socket.on('loadcontent', function(data) {
			   		if (content3 == undefined) {
				   		content3 = data;
					    var p1 = document.createElement("p");
					    p1.style = "margin-left: 20px; font-size: 125%;";
					    p1.innerHTML = content3;
						sourcewritten.innerHTML = '';	
					    sourcewritten.appendChild(p1);

						var script = document.createElement('script');
						script.type = "text/javascript";
					    script.charset = "utf-8";
					    script.src = "js/jqmath-etc-0.4.6.min.js"; 
					    document.getElementsByTagName("head")[0].appendChild(script);
					    console.log(content1);
						console.log(content2);
						console.log(content3);
					}

			   	});
			} else if (openfile[num] == 0) {
				openfile[num] = 1;
				sourcewritten.innerHTML = ' ';
				content3 = undefined;
			}
		break;
	}
}
