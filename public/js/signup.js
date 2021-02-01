var socket = io.connect(); 

let inputEmailsign = document.getElementById("inputEmailsign");
let inputPasswordsign = document.getElementById("inputPasswordsign");

socket.on('signupdata', function(data) {
	switch (data[0]) {
		case 1: //successfully created user
		console.log("user has been created.")
		console.log(data[1])
		console.log(data[1].apiKey)
		break;

		case 0: //failed created user
			console.log(data[1])
		break;
	}
});

function signup() {
	var data = [inputEmailsign.value, inputPasswordsign.value]
	socket.emit('signupdata', data)	
	event.preventDefault()
}


function signupredirect() {
	window.location.href = '/signup';
	event.preventDefault()
}
