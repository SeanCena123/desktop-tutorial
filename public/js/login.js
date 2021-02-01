var socket = io.connect(); 

socket.emit('connections', 'value');
	
let inputEmail = document.getElementById("inputEmail");
let inputPassword = document.getElementById("inputPassword");
let loginid = document.getElementById("loginid");
let signoutid = document.getElementById("signoutid");
let buttons = document.getElementById("buttons");
var userdata;
var storeduser;

async function login() {
	var currentuser = JSON.parse(sessionStorage.getItem("user"));
	if (currentuser != null) {
		console.log("user is alreayd logged in.");
	} else {
		var data = await [inputEmail.value, inputPassword.value]
		await socket.emit('logindata', data)
		event.preventDefault()
	}
}

function signupredirect() {
	window.location.href = '/signup';
	event.preventDefault()
}

function proceed() {
	window.location.href = '/database';
}

function signout() {
	var currentuser = JSON.parse(sessionStorage.getItem("user"));
	if (currentuser != null) {
		currentuser = sessionStorage.setItem("user", JSON.stringify(null));
		console.log("currentuser is now "+currentuser);
		checkuser();
		socket.emit('signout', 'value')
	} else {
		console.log("user is already logged out.")
	}
}

socket.on('loginsuccess', function(data) {
	window.location.href = '/signup';
	socket.emit('loginsuccess', 'value')
});

socket.on('signout', function(data) {
	console.log("user is signed out.")
});

function checkuser() {
	var currentuser = JSON.parse(sessionStorage.getItem("user"));
	if (currentuser != null) {
		console.log("user is still logged in.")
		console.log(currentuser);
		buttons.innerHTML = '<button id="proceedid" class="btn btn-lg btn-success btn-block" type="submit" onclick="proceed()">Database</button>  <button id="signoutid" class="btn btn-lg btn-danger btn-block" type="submit" onclick="signout()">Sign Out</button>';
	} else {
		console.log("user is not logged in.")
		buttons.innerHTML = '<button class="btn btn-lg btn-success btn-block" type="submit" onclick="signupredirect()">Sign Up</button>  <button id="loginid" class="btn btn-lg btn-success btn-block" type="submit" onclick="login()">Sign In</button>';
	}
}
checkuser();

socket.on('signInWithEmailAndPassword', async function(data) {
	switch (data) {
		case 1: //successfully created user
			sessionStorage.setItem("user", JSON.stringify(data));
			storeduser = JSON.parse(sessionStorage.getItem("user"));
			// console.log(storeduser);
			userdata = await data;
			await console.log(data);

			if (userdata) {
				window.location.href = await '/database';
				socket.emit('userdata', userdata);
				event.preventDefault()
			} else {
				console.log("fail")
			}
		break;

		case 0: //failed created user
			console.log("Incorrect username or password.");
		break;
	}
});

socket.on('userdata', async function(data) {
	console.log(storeduser);
});