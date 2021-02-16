var socket = io.connect(); 

socket.emit('connections', 'value');
	
var inputEmail = document.getElementById("inputEmail");
var inputPassword = document.getElementById("inputPassword");
let loginid = document.getElementById("loginid");
let signoutid = document.getElementById("signoutid");
let buttons = document.getElementById("buttons");
var credentials = document.getElementById("credentials");
var errorplacementlogin = document.getElementById('error-placement-login');

var userdata;
var storeduser;
var accept;

var x = JSON.parse(sessionStorage.getItem("user"));

// socket.emit('verifyuser', x);

// socket.on('verifyuser', function(data) {
	async function login() {
		accept = 0;
		var currentuser = JSON.parse(sessionStorage.getItem("user"));
		inputEmail = document.getElementById("inputEmail");
		inputPassword = document.getElementById("inputPassword");
		if (currentuser != null) {
			console.log("user is already logged in.");
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
		event.preventDefault()
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
		signout();
		console.log("user is signed out.")
	});

	function checkuser() {
		var currentuser = JSON.parse(sessionStorage.getItem("user"));
		if (currentuser != null) {
			console.log("user is still logged in.")
			credentials.innerHTML = '';
			buttons.innerHTML = '<button id="proceedid" class="btn btn-lg btn-success btn-block" type="submit" onclick="proceed()">Database</button> <button id="proceedid" class="btn btn-lg btn-success btn-block" type="submit" onclick="accountfunc()">Account</button> <button class="btn btn-lg btn-success btn-block" type="submit" onclick="signupredirect()">Sign Up</button>   <button id="signoutid" class="btn btn-lg btn-danger btn-block" type="submit" style="background-color: red;" onclick="signout()">Sign Out</button>';
		} else {
			console.log("user is not logged in.")
			credentials.innerHTML = `<label for="inputEmail" class="sr-only">Email address</label>      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>      <label for="inputPassword" class="sr-only">Password</label>      <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>`;
			buttons.innerHTML = '<button id="loginid" class="btn btn-lg btn-success btn-block" type="submit" onclick="login()">Sign In</button>';
		}
	}
	checkuser();


	socket.on('signInWithEmailAndPassword', async function(data) {
		switch (data[0]) {
			case 1: //successfully created user
				accept = 1;
				errorplacementlogin.innerHTML = '';
				sessionStorage.setItem("user", JSON.stringify(data[1]));
				storeduser = JSON.parse(sessionStorage.getItem("user"));
				// console.log(storeduser);
				userdata = await data[1];
				await console.log(data[1]);

				if (userdata) {
					window.location.href = await '/database';
					socket.emit('userdata', userdata);
					await event.preventDefault()
				} else {
					console.log("fail")
				}
			break;
			case 0: //failed created user	
				if (accept != 1) {
					errorplacementlogin.innerHTML = '';
					var p1 = document.createElement('p');
					var b1 = document.createElement('b');
					
					p1.style = "color: red; font-size: 13px; margin-top: 10px;";
					b1.innerHTML = "Incorrect email or password.";
			  
					p1.appendChild(b1);
					errorplacementlogin.appendChild(p1)
				}			
			break;
		}
	});

	socket.on('userdata', async function(data) {
		console.log(storeduser);
	});
//});