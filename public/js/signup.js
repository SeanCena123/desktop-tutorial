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

socket.once('signupdata', async function(data) {
	switch (data[0]) {
		case 1: //successfully created user
			console.log("running good")
			console.log("user has been created.")
			var p1 = document.createElement('p');
			var b1 = document.createElement('b');
			
			p1.style = "color: green; font-size: 13px; margin-top: 10px;";
			b1.innerHTML = "user has been created.";
	  
			p1.appendChild(b1);
			errorplacementsignup.appendChild(p1)

			const el = document.createElement('textarea');
			el.value = "email: "+data[1]+" | password: "+data[2];
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);			

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
			console.log("running failed")
			errorplacementsignup.innerHTML = '';
			var p1 = document.createElement('p');
			var b1 = document.createElement('b');
			
			p1.style = "color: red; font-size: 13px; margin-top: 10px;";
			b1.innerHTML = data[1];
	  
			p1.appendChild(b1);
			errorplacementsignup.appendChild(p1)
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
	var data = [
		accountTypesign.innerHTML,
		inputFirstNamesign.value,
		inputLastNamesign.value,
		inputYearLevelsign.value,
		inputSchoolsign.value,
		inputEmailsign.value, 
		inputPasswordsign.value
	]

	if (data[0] == 'Account Type' || data[1] == '' || data[2] == '' || data[3] == '' || data[4] == '' || data[5] == '' || data[6] == '') {
		errorplacementsignup.innerHTML = '';
		var p1 = document.createElement('p');
		var b1 = document.createElement('b');
		
		p1.style = "color: red; font-size: 13px; margin-top: 10px;";
		b1.innerHTML = "Your left some empty spaces.";
  
		p1.appendChild(b1);
		errorplacementsignup.appendChild(p1)
	} else {
		console.log("processing sign up form.")
		socket.emit('signupdata', data)	
	}

	event.preventDefault()
}

function generatepass() {
	socket.emit('generatepass', 'value');
}

socket.on('generatepass', async function(data) {
	inputPasswordsign = document.getElementById("inputPasswordsign");
	console.log(data);
	inputPasswordsign.value = data;
});

function signupredirect() {
	window.location.href = '/signup';
	event.preventDefault()
}
