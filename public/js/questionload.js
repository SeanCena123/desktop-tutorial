var socket = io.connect(); 
socket.emit('arrayrec', 'value')

let examcontent = document.getElementById("examcontent");
let titlecontent = document.getElementById("titlecontent");
let descriptioncontent = document.getElementById("descriptioncontent");
let viewfiles = document.getElementById("viewfiles");
let viewfilessolution = document.getElementById("viewfilessolution")
let viewfileswritten = document.getElementById("viewfileswritten");

socket.on('arrayrec', function(data) {
	console.log(data)
	loadcontent(0, data[3])
	examcontent.innerHTML = data[2];
	titlecontent.innerHTML = data[0];
	descriptioncontent.innerHTML = data[1];

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