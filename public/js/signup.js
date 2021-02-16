var socket = io.connect({secure: true}); 
var currentuser = JSON.parse(sessionStorage.getItem("user"));
var signupbody = document.getElementById("signupbody");
var inputFirstNamesign;
var inputLastNamesign;
var inputYearLevelsign;
var inputSchoolsign;
let inputEmailsign;
let inputPasswordsign;
var accountTypesign;
var errorplacementsignup;


if (currentuser != null) {  
	socket.emit('tokenverify', currentuser);
    socket.on('tokenverify', async function(data) {
        await localStorage.setItem("token", data);
        currentoken = await localStorage.getItem("token");
        console.log(currentoken);
        socket.emit('tokenverification', currentoken);
    });

    socket.on('tokenverification', async function(exit) {
        console.log("user token authorized.")
        socket.emit('signupbody', 'value');

        socket.on('signupbody', async function(data) {
			signupbody.innerHTML = await data;

			inputFirstNamesign = document.getElementById("inputFirstNamesign");
			inputLastNamesign = document.getElementById("inputLastNamesign");
			inputYearLevelsign = document.getElementById("inputYearLevelsign");
			inputSchoolsign = document.getElementById("inputSchoolsign");
			inputEmailsign = document.getElementById("inputEmailsign");
			inputPasswordsign = document.getElementById("inputPasswordsign");
			accountTypesign = document.getElementById("accountTypesign");
			errorplacementsignup = document.getElementById("errorplacementsignup");
			
		});

	});

}

var accept;
socket.on('signupdata', async function(data) {
	switch (data[0]) {
		case 1: //successfully created user
		    accept = await 1;
			console.log("running good")
			console.log("user has been created.")
			var p1 = document.createElement('p');
			var b1 = document.createElement('b');
			
			p1.style = "color: green; font-size: 13px; margin-top: 10px;";
			b1.innerHTML = "user has been created.";
	  
			p1.appendChild(b1);
			errorplacementsignup.appendChild(p1)
			console.log(data[1]);

			inputFirstNamesign.value = '';
			inputLastNamesign.value = '';
			inputYearLevelsign.value = '';
			inputSchoolsign.value = '';
			inputEmailsign.value = '';
			inputPasswordsign.value = '';
			accountTypesign.innerHTML = 'Account Type';
			errorplacementsignup.innerHTML = '';

		break;

		case 0: //failed created user
		if (accept != 1) {
			console.log("running failed")
			errorplacementsignup.innerHTML = '';
			var p1 = document.createElement('p');
			var b1 = document.createElement('b');
			
			p1.style = "color: red; font-size: 13px; margin-top: 10px;";
			b1.innerHTML = data[1];
	  
			p1.appendChild(b1);
			errorplacementsignup.appendChild(p1)
		}
		break;
	}
});

function accounttypechoose(value) {
	switch (value) {
		case 0: //student
		accountTypesign.innerHTML = "Student";
		break;
		case 1: //teacher
		accountTypesign.innerHTML = "Teacher";
		break;
		case 2: //developer
		accountTypesign.innerHTML = "Developer";
		break;
	}
}

function signup() {
	accept = 0;
	var data = [
		accountTypesign.innerHTML,
		inputFirstNamesign.value,
		inputLastNamesign.value,
		inputYearLevelsign.value,
		inputSchoolsign.value,
		inputEmailsign.value, 
		inputPasswordsign.value
	]

	if (data[0] == 'Account Type' || data[1] == ' ' || data[2] == ' ' || data[3] == ' ' || data[4] == ' ' || data[5] == ' ' || data[6] == ' ') {
		console.log("Empty boxes.")
	} else {
		console.log("processing sign up form.")
		socket.emit('signupdata', data)	
	}

	event.preventDefault()
}


function signupredirect() {
	window.location.href = '/signup';
	event.preventDefault()
}
