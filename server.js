//Initiating Global Variables
require('dotenv').config();
require('firebase/app');
require('firebase/database');

var express = require('express');
var app = express();
const path = require('path')
const port = process.env.PORT;
var firebase = require('firebase');
// var firebaseui = require('firebaseui');

app.use(express.static('public'));

// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#firebaseui-auth-container', {
//   signInOptions: [
//     firebase.auth.EmailAuthProvider.PROVIDER_ID
//   ],
// });

var examnum;
var dbarr = [];

var firebaseConfig = {
apiKey: process.env.APIKEY,
authDomain: process.env.AUTHDOMAIN,
databaseURL: process.env.DATABASEURL,
projectId: process.env.PROJECTID,
storageBucket: process.env.STORAGEBUCKET,
messagingSenderId: process.env.MESSAGINGSENDERID,
appId: process.env.APPID,
measurementId: process.env.MEASUREMENTID
};
firebase.initializeApp(firebaseConfig);	

var server = app.listen(port, function() {
	console.log('Our app is running on https://localhost:' + port);
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {
 	var clientIp = socket.request.connection.remoteAddress;
 	var clientTime = socket.handshake.time;
    console.log("User: "+socket.id+", Connected.");

     socket.on('verifyuser', async function(data) {
        var ref = await firebase.database().ref('Users/');
		await ref.on('value', async function(snapshot) { 
			var totalusers = await snapshot.numChildren(); 

			for (var i = 1; i < (totalusers+1); i++) {

				var credentials = await [
				firebase.database().ref('Users/'+i+"/accessToken"),
				firebase.database().ref('Users/'+i+"/apiKey"),
				firebase.database().ref('Users/'+i+"/creationTime"),
				firebase.database().ref('Users/'+i+"/email"),
				firebase.database().ref('Users/'+i+"/emailVerified"),
				firebase.database().ref('Users/'+i+"/expirationTime"),
				firebase.database().ref('Users/'+i+"/isAnonymous"),
				firebase.database().ref('Users/'+i+"/lastLoginAt"),
				firebase.database().ref('Users/'+i+"/lastSignInTime"),
				firebase.database().ref('Users/'+i+"/refreshToken"),
				firebase.database().ref('Users/'+i+"/uid"),
				firebase.database().ref('Users/'+i+"/userpassword")
				]

				var verifycount = 0;
				var founduser = 0;
				for (var a = 0; a < credentials.length; a++) {
					credentials[a].on('value', async function(snapshot) { 
						if (data[a] == snapshot.val()) {
							verifycount++;
						} 
					});	

					if (a == ((credentials.length)-1)) {
						if (verifycount == credentials.length) {
							console.log("user "+i+" successfully verified.");
							socket.emit('verifyuser', 'value'); //continuing client tasks
							founduser = 1;
							break;
						} else {
							console.log("user "+i+" failed verification.");
						}
					}

				}
				if (founduser == 1) {
					break;
				}
				if (i == (totalusers)) {
					if (founduser == 0) {
						console.log("user logging out...");
						//do action of printing out error webpage or returning the client back to logged out user. 
					}				
				}

			}

	  	})
    });  

    socket.on('usercurrentlogin', function(data) {
    	socket.emit('arrayrec', datatest);
    });

	var id;
    socket.on('tokenverify', function(data) {
		id = data[12];
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < 228; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		var tokenverifyaddress = firebase.database().ref('Users/'+data[12]);

		tokenverifyaddress.update({
			"token": result
		});

		console.log(data[12]);
		return socket.emit('tokenverify', result);
    });

	socket.on('generatepass', function(data) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < 9; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return socket.emit('generatepass', result);
    });

    socket.on('tokenverification', function(data) {
		tokenfunc('tokenverification', data);
    });

	socket.on('tokenverification2', function(data) {
		tokenfunc('tokenverification2', data);
    });

	function tokenfunc(name, data) {
		var tokenvalue = firebase.database().ref('Users/'+id+'/token');
		tokenvalue.on('value', async function(snapshot) { 
			console.log(snapshot.val());
			console.log(data);
			if (data == snapshot.val()) {
				socket.emit(name, true);
				console.log("user token authorised.")
			} else {
				var databasebodytext = ' ';
				var accounttext = '';
				var signupbody = '';
				socket.emit('accountbody', accounttext);
				socket.emit('databasebody', databasebodytext);
				socket.emit('signupbody', signupbody);
				socket.emit('signout', 'value');
				console.log("user token failed.")
			}
		})
	}

    socket.on('connections', function(data) {
		var connectionsocket = firebase.database().ref('Storage/Connections');

		connectionsocket.transaction(function(currentClicks) {
			return (currentClicks || 0) + 1;
		});  

    });
            
    var totalexams = firebase.database().ref('Database/Exam-Data');
	async function createDatabaseArray() {
		dbarr = [];
		var data = [];
		for (var i = 1; i < examnum; i++) {
            var ref = await firebase.database().ref('Database/Exam-Data/'+i);
			await ref.on('value', async function(snapshot) { 
				data = await snapshot.numChildren(); 

				for (var p = 1; p < (data+1); p++) {
					var descriptiontextref = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/descriptiontext');
					var displaytextref = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/displaytext');
					var textref = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/text');
					var titleref = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/title');
					var lowercasetext = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/lowercasetext');
					var examtext = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/examtext');
					var pdftext = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/pdftext');
					var solutiontext = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/solutiontext');
					var writetext = firebase.database().ref('Database/Exam-Data/'+i+'/Q'+p+'/writetext');
					var arradd = [];

					descriptiontextref.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					displaytextref.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					textref.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					titleref.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					lowercasetext.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					examtext.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					pdftext.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					solutiontext.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					writetext.on('value', async function(snapshot) { 
						arradd.push(snapshot.val());
					});
					dbarr.push(arradd);
				}

				if (i == (examnum-1)) {
					// console.log(dbarr);
					socket.emit('array', dbarr);
				}

			});
		}
	}
	totalexams.on('value', async function(snapshot) { 
		data = await snapshot.numChildren();
		examnum = await (data+1);
		await createDatabaseArray();
	});

	var amountlabel = 0;
	var pagearr = [];
	socket.on('searching', async function(data) {
		var validcount = 0;
		var pageidnum = 1;
		var pagecurr = 2;
		var sortedarr = []; 
		pagearr = [];

		async function resultsearchfunc(title, description, page, display, value) {
			var datasent = [title, description, page, value, display];
			pagearr.push(datasent)
			var data = [amountlabel, totalresult, datasent];
			await socket.emit('resultsearchfunc', data)
		}

		function sortFunction(a, b) {
		    if (a[2] === b[2]) {
		        return 0;
		    }
		    else {
		        return (a[2] > b[2]) ? -1 : 1;
		    }
		}

		var res = data.split(" ");
		amountlabel = 0;

		const index = res.indexOf("");
		if (index > -1) {
		  	res.splice(index, 1);
		}

		if (data == '') {
			var data = [0]
			socekt.emit('searching', data)
		} else {
			for (var k = 0; k < dbarr.length; k++) {
				validcount = 0;	
				// console.log("K =================="+k);
				// console.log(dbarr[k][2]);
				// console.log("-------------------------------------------------------");
				// console.log("-----------------NORMAL SEARCHING------------------");
				// console.log("-------------------------------------------------------");

				//Normal Search (Singular)
				for (var i = 0; i < res.length; i++) {
					var n = dbarr[k][2].search(res[i]);
						// console.log("[SINGULAR WORD SEARCH] find word match of "+"'"+res[i]+"'"+" at: "+n);
					if ((typeof n === 'undefined') || (n == -1)) {
						// console.log("NO MATCH FOUND");
						// console.log("validcount: "+validcount+" (SAME)");
					} else if (res[i] == '') {
						validcount++;
						// console.log("MATCH FOUND");
						// console.log("validcount: "+validcount+" (CHANGES)");
						// console.log("---------------------------------------------------");	
					} else {
						validcount ++;
						// console.log("MATCH FOUND");
						// console.log("validcount: "+validcount+" (CHANGES)");
						// console.log("---------------------------------------------------");
					}
				}

				//Normal Search (Group)
				var a;
				if (res.length > 1) {
					var p = (res.length-1);
					for (var a = 0; a < res.length; a++) {
						resolution = ''
						p++;
						// console.log("p:"+p);
						for (var i = a; i < res.length; i++) {
							// console.log(dbarr[k][2])
							resolution = resolution.concat(" ");
							resolution = resolution.concat(res[i]);
							var n1 = dbarr[k][2].search(resolution);
							if ((typeof n1 === 'undefined') || (n1 == -1)) {
								// console.log("[GROUP SEARCH] find word match of "+"'"+resolution+"'"+" at: "+n);
								// console.log("NO MATCH FOUND");
								// console.log("validcount: "+validcount+" (SAME)");
							} else if (resolution == '') {
								validcount++;
								// console.log("MATCH FOUND");
								// console.log("validcount: "+validcount+" (CHANGES)");
								// console.log("---------------------------------------------------");			
							} else {
								validcount ++;
								// console.log("[GROUP SEARCH] find word match of "+"'"+resolution+"'"+" at: "+n);
								// console.log("MATCH FOUND");
								// console.log("validcount: "+validcount+" (CHANGES)");
								// console.log("---------------------------------------------------");
							}
						}
					}
				} 

				// console.log("-------------------------------------------------------");
				// console.log("-----------------LOWER CASE SEARCHING------------------");
				// console.log("-------------------------------------------------------");
				//Lowercase Search (Singular)
				for (var i = 0; i < res.length; i++) {
					var n = dbarr[k][4].search(res[i]);
					// console.log("[SINGULAR WORD SEARCH (LOWER CASE)] find word match of "+"'"+res[i]+"'"+" at: "+n);
					if ((typeof n === 'undefined') || (n == -1)) {
						// console.log("NO MATCH FOUND");
						// console.log("validcount: "+validcount+" (SAME)");
					} else if (res[i] == '') {
						validcount++;
						// console.log("MATCH FOUND");
						// console.log("validcount: "+validcount+" (CHANGES)");
						// console.log("---------------------------------------------------");	
					} else {
						validcount ++;
						// console.log("MATCH FOUND");
						// console.log("validcount: "+validcount+" (CHANGES)");
						// console.log("---------------------------------------------------");
					}
				}

				//Lowercase Search (Group)
				var a;
				if (res.length > 1) {
					var p = (res.length-1);
					for (var a = 0; a < res.length; a++) {
						resolution = ''
						p++;
						// console.log("p:"+p);
						for (var i = a; i < res.length; i++) {
							resolution = resolution.concat(" ");
							resolution = resolution.concat(res[i]);
							resolution = resolution.toLowerCase();
							var lowercasetext = dbarr[k][2].toLowerCase();
							// console.log(lowercasetext);
							var n1 = lowercasetext.search(resolution);
							if ((typeof n1 === 'undefined') || (n1 == -1)) {
								// console.log("[GROUP SEARCH (LOWER CASE)] find word match of "+"'"+resolution+"'"+" at: "+n);
								// console.log("NO MATCH FOUND");
								// console.log("validcount: "+validcount+" (SAME)");
							} else if (resolution == '') {
								validcount++;
								// console.log("MATCH FOUND");
								// console.log("validcount: "+validcount+" (CHANGES)");
								// console.log("---------------------------------------------------");			
							} else {
								validcount ++;
								// console.log("[GROUP SEARCH] find word match of "+"'"+resolution+"'"+" at: "+n);
								// console.log("MATCH FOUND");
								// console.log("validcount: "+validcount+" (CHANGES)");
								// console.log("---------------------------------------------------");
							}
						}
					if (a == (res.length - 1)) {
						var tag = [dbarr[k][1], dbarr[k][3], validcount, k, dbarr[k][5], dbarr[k][0]];
						sortedarr.push(tag);
						sortedarr.sort(sortFunction)
						// console.log(sortedarr);
					}
					}
				} else {
					var tag = [dbarr[k][1], dbarr[k][3], validcount, k, dbarr[k][5], dbarr[k][0]];
					sortedarr.push(tag);
					sortedarr.sort(sortFunction)
					// console.log(sortedarr);
				}
			} //Finishing the k for loop

			for (var i = 0; i < sortedarr.length; i++) {
				if (sortedarr[i][2] > 0) {
					amountlabel++;
					await resultsearchfunc(sortedarr[i][1], sortedarr[i][0], sortedarr[i][4], sortedarr[i][5], sortedarr[i][3]);
					//resultsearchfunc(sortedarr[i][1], sortedarr[i][0], sortedarr[i][4], sortedarr[i][5], sortedarr[i][3]);
				}
				if (i == (sortedarr.length-1)) {
					var data = [1, pagearr];
					await socket.emit('searching', data);
				}
			}
		}
    });

	var offarr = [];
	var arrFiltered = [];
	var totalresult = 3; //change to show how many results you want per page
   	socket.on('paginationarray', async function(data) {
		var start = 0;
		var end = totalresult;
		offarr = [];

		for (var i = 0; i < amountlabel; i++) {
			var slicedArr = pagearr.slice(start, end);
			offarr.push(slicedArr);
			start +=totalresult;
			end +=totalresult;

			if (i == amountlabel-1) {
				arrFiltered = offarr.filter(el => {
				  return el != null && el != '';
				});
				await socket.emit('paginationarray', arrFiltered);
			}

		}
    });

   	socket.on('searchresultpage', function(data) {
   		socket.emit('searchresultpage', data);
    });

   	socket.on('searchresultnum', function(data) {
   		socket.emit('searchresultnum', amountlabel);
    });

   	socket.on('loadcontent', function(data) {
   		var content = dbarr[data[0]][data[1]];
   		// console.log(content);
   		socket.emit('loadcontent', content);
    });

    socket.on('arrayreq', function(data) {
    	// console.log(data);
    	datatest = data;
    });
    socket.on('arrayrec', function(data) {
    	socket.emit('arrayrec', datatest);
    });

    socket.on('signupdata', async function(data) {
		var usercred = data;
		email = data[5];
		password = data[6]

            var ref = await firebase.database().ref('Users/');
			await ref.on('value', async function(snapshot) { 
				var totalusers = await snapshot.numChildren(); 

            	var userdirectory = await firebase.database().ref('Users/'+(totalusers+1));

				firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
				    // Signed in 
				    var user = userCredential.user;
				    console.log(user);

				    userdirectory.child("apiKey").set(user.l);
				    userdirectory.child("uid").set(user.uid);
				    userdirectory.child("displayName").set(user.displayName);
				    userdirectory.child("photoURL").set(user.photoURL);
				    userdirectory.child("email").set(user.email);
				    userdirectory.child("userpassword").set(password);
				    userdirectory.child("emailVerified").set(user.emailVerified);
				    userdirectory.child("phoneNumber").set(user.phoneNumber);
				    userdirectory.child("isAnonymous").set(user.isAnonymous);
				    userdirectory.child("creationTime").set(user.metadata.creationTime);
				    userdirectory.child("lastSignInTime").set(user.metadata.lastSignInTime);
				    userdirectory.child("accessToken").set(user.za);
				    userdirectory.child("refreshToken").set(user.refreshToken);
				    userdirectory.child("expirationTime").set(user.b.c);
				    userdirectory.child("lastLoginAt").set(user.metadata.a);

					userdirectory.child("account-type").set(usercred[0]);
					userdirectory.child("first-name").set(usercred[1]);
					userdirectory.child("last-name").set(usercred[2]);
					userdirectory.child("year-level").set(usercred[3]);
					userdirectory.child("school-name").set(usercred[4]);

				    var data = [1, user.email, password]
				    console.log("successfully created user.")
				    socket.emit('signupdata', data);
				    // ...

				}).catch((error) => {
				    var data = [0, error.message];
				    console.log(error.message);
				    socket.emit('signupdata', data);
				    // ..
		  		});
		  	})
    });

    var email;
    var password;
    var user;
    socket.on('logindata', async function(data) {
    	console.log(data[0]);
    	console.log(data[1]);
    	useremailarr = data[0];
    	userpasswordarr = data[1];

    	var emailvalid = 0;
    	var passwordvalid = 0;

            var ref = await firebase.database().ref('Users/');
			await ref.once('value', async function(snapshot) { 
				var totalusers = await snapshot.numChildren(); 

    				for (var i = 1; i < (totalusers+1); i++) {
            			var useremail = await firebase.database().ref('Users/'+i+"/email");
            			var userpassword = await firebase.database().ref('Users/'+i+"/userpassword");

            			
            			await useremail.once('value', async function(snapshot) { 
							if (useremailarr == snapshot.val()) {
								emailvalid = 1;
								console.log("email is correct.")
							} else {
								emailvalid = 0;
								console.log("email is incorrect.")
							}
						});

            			await userpassword.once('value', async function(snapshot) { 
							if (userpasswordarr == snapshot.val()) {
								passwordvalid = 1;
								console.log("password is correct.")
							} else {
								passwordvalid = 0;
								console.log("password is incorrect.")
							}
						});

            			if ((emailvalid == 1) && (passwordvalid == 1)) {
            				console.log("user is able to sign in.");

            				var firebasekeys = [
							firebase.database().ref('Users/'+i+'/accessToken'),
							firebase.database().ref('Users/'+i+'/apiKey'),
							firebase.database().ref('Users/'+i+'/creationTime'),
							firebase.database().ref('Users/'+i+'/email'),
							firebase.database().ref('Users/'+i+'/emailVerified'),
							firebase.database().ref('Users/'+i+'/expirationTime'),
							firebase.database().ref('Users/'+i+'/isAnonymous'),
							firebase.database().ref('Users/'+i+'/lastLoginAt'),
							firebase.database().ref('Users/'+i+'/lastSignInTime'),
							firebase.database().ref('Users/'+i+'/refreshToken'),
							firebase.database().ref('Users/'+i+'/uid'),
							firebase.database().ref('Users/'+i+'/userpassword')
            				];
            				var arruser = [];

            				for (var a = 0; a < firebasekeys.length; a++) {
            					firebasekeys[a].once('value', async function(snapshot) { 
									await arruser.push(snapshot.val());
								});	
            				}
							arruser.push(i);

            				var data = [1, arruser]
            				socket.emit('signInWithEmailAndPassword', data);
						} else {
							console.log("user is unable to sign in.")
							var data = [0, 'error']
							socket.emit('signInWithEmailAndPassword', data);
						}

            				
    				}

			});
    });

	socket.on('userdata', function(data) {
		console.log(data);
		socket.emit('userdata', data);
	});


	var databasebodytext = ` <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top" style="outline: black; ">        <a class="navbar-brand" href="/" style="color: #31b08f;;"><b>VIOLA</b></a>        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">          <span class="navbar-toggler-icon"></span>        </button>              <div class="collapse navbar-collapse" id="navbarSupportedContent">          <ul class="navbar-nav mr-auto">            <li class="nav-item">              <a class="nav-link" onclick="sessionstatefunc()" style="cursor: pointer">Database</a>            </li>            <li class="nav-item">              <a class="nav-link" href="#">About</a>            </li>          </ul>          <form class="form-inline my-2 my-lg-0">            <a class="btn my-2 my-sm-0" type="submit" style="color: white" href='/account'>Account</a>          </form>        </div>      </nav> <div class="" style="color: #31b08f;">    <h1 class="display-4" style="margin-bottom: -2%"> <b> Viola Education Database </b></h1>    <h1 class="display-10" style="margin-bottom: 7.5%; font-size: 1.1em;"> Enhance your VCE experience by exploring our database for past questions </h1>  </div>  <div class="container d-flex justify-content-center" style="margin-top: -5%;">    <div class="card mt-2 p-4" style="width: 100%;">                <div class="input-group mb-3">           <input id="searchinput" type="text" class="form-control" placeholder="Type your question...">            <div class="input-group-append">              <button class="btn btn-success" id="buttonsearch" onclick="mouseclicksearch()"><i class="fas fa-search"></i>Search</button>            </div>        </div>         <div style="text-align: center; margin-right: 20px">          <div style="display:inline-block;">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonsubject" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Subject</button>                <div class="dropdown-menu dropdown" aria-labelledby="dropdownMenuButton">              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 0)'>None</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Methods", 0)'>Methods</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Physics", 0)'>Physics</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Chemistry", 0)'>Chemistry</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Further", 0)'>Further</a>            </div>          </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonsource" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Source</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 1)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("VCAA", 1)'>VCAA</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("NHT", 1)'>NHT</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonyear" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Year</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 2)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2019", 2)'>2019</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2018", 2)'>2018</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2017", 2)'>2017</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonunit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Unit</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 3)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Unit 3", 3)'>Unit 3</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Unit 4", 3)'>Unit 4</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtontopic" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Topic</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="topicid">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 4)'>None</a>              </div>           </div>           <hr>        </div>        <div id="resultamount"> </div>        <div id="resultsearch"> </div>        <br>          <div id="pageid"> </div>    </div>   </div>    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>    <link rel="stylesheet" type="text/css" href="css/style.css" />    <script type="text/javascript" src="js/load.js"></script>     <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script>    <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js"></script>    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>    <script src="js/bootstrap.min.js"></script>`;
	var accountbodytext = `    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top" style="outline: black; ">        <a class="navbar-brand" href="/" style="color: #31b08f;;"><b>VIOLA</b></a>        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">          <span class="navbar-toggler-icon"></span>        </button>              <div class="collapse navbar-collapse" id="navbarSupportedContent">          <ul class="navbar-nav mr-auto">            <li class="nav-item">              <a class="nav-link" onclick="sessionstatefunc()" style="cursor: pointer">Database</a>            </li>            <li class="nav-item">              <a class="nav-link" href="#">About</a>            </li>          </ul>          <form class="form-inline my-2 my-lg-0">            <a class="btn my-2 my-sm-0" type="submit" style="color: white" href="/account">Account</a>          </form>        </div>      </nav>        <div class="" style="color: #31b08f;">    <h1 class="display-5" style="margin-bottom: 20px"> <b> Account Settings </b></h1>    <h1 class="display-4" style="font-size: 15px; margin-top: -10px;"> <b>To confirm changes, press enter.</b></h1>    <div style="text-align: center;">        <h1 class="display-4" style="font-size: 20px;">First Name:            <center>            <input class="form-control text-center" id="first-name" style="margin-top: 10px; width: 30%;"></input>          </center>        </h1>    </div>     <div style="text-align: center;">        <h1 class="display-4" style="font-size: 20px;">Last Name:           <center>            <input class="form-control text-center" id="last-name" style="margin-top: 10px; width: 30%;"></input>          </center>        </h1>    </div>    <div style="text-align: center;">      <h1 class="display-4" style="font-size: 20px;">Year Level         <center>          <input class="form-control text-center" id="year-level" style="margin-top: 10px; width: 30%;" disabled></input>        </center>      </h1>  </div>      <div style="text-align: center;">      <h1 class="display-4" style="font-size: 20px;">Account Type         <center>          <input class="form-control text-center" id="account-type" style="margin-top: 10px; width: 30%;" disabled></input>        </center>        </h1>  </div>     <div style="text-align: center;">        <h1 class="display-4" style="font-size: 20px;">School:           <center>            <input class="form-control text-center" id="school-name" style="margin-top: 10px; width: 30%;" disabled></input>          </center>          </h1>    </div>    <div style="text-align: center;">        <h1 class="display-4" style="font-size: 20px;">Reset Password:           <center>            <input class="form-control text-center" id="reset-password" type="password" style="margin-top: 10px; width: 30%;" placeholder="type new password"></input>            <input class="form-control text-center" id="reset-password-retype" type="password" style="margin-top: 10px; width: 30%;" placeholder="retype new password"></input>          </center>          <center>            <div id="error-placement">            </div>          </center>            <center>              <button class="btn btn-lg btn-success btn-block" type="submit" onclick="resetpassword()" style="margin-top: 10px; width: 30%;">Submit</button>            </center><br>          </h1>    </div>  </div><script type="text/javascript" src="js/token.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script><link rel="stylesheet" type="text/css" href="css/style.css" /><script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script><script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script><script src="js/bootstrap.min.js"></script><script type="text/javascript" src="js/account.js"></script>`;
	var signupbody = `  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top" style="outline: black; ">      <a class="navbar-brand" href="/" style="color: #31b08f;;"><b>VIOLA</b></a>      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">        <span class="navbar-toggler-icon"></span>      </button>          <div class="collapse navbar-collapse" id="navbarSupportedContent">        <ul class="navbar-nav mr-auto">          <li class="nav-item">            <a class="nav-link" onclick="sessionstatefunc()" style="cursor: pointer">Database</a>          </li>          <li class="nav-item">            <a class="nav-link" href="#">About</a>          </li>        </ul>        <form class="form-inline my-2 my-lg-0">          <a class="btn my-2 my-sm-0" type="submit" style="color: white" href="/account">Account</a>        </form>      </div>    </nav>        <div class="text-center">      <form class="form-signin">        <h1 class="display-5" style="margin-bottom: 20px"> <b style="color: #31b08f;"> SIGN UP USERS </b></h1> <br>                <div class="dropdown" style="margin-bottom: 15px;">          <button class="btn btn-success dropdown-toggle" type="button" id="accountTypesign" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Account Type</button>          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">            <a class="dropdown-item" href="#" onclick="accounttypechoose(0);">Student</a>            <a class="dropdown-item" href="#" onclick="accounttypechoose(1);">Teacher</a>            <a class="dropdown-item" href="#" onclick="accounttypechoose(2);">Developer</a>          </div>        </div>        <center>          <label for="inputFirstNamesign" class="sr-only">First Name</label>          <input id="inputFirstNamesign" class="form-control text-center" style="width: 35%; margin-bottom: 5px;" placeholder="First Name" required autofocus> </input>        </center>      <center>        <label for="inputLastNamesign" class="sr-only">Last Name</label>        <input id="inputLastNamesign" class="form-control text-center" style="width: 35%;" placeholder="Last Name" required autofocus> <br>      </center><br>      <center>        <label for="inputYearLevelsign" class="sr-only">Year Level</label>        <input id="inputYearLevelsign" class="form-control text-center" style="width: 35%;" placeholder="Year Level" required autofocus> <br>      </center><br>      <center>        <label for="inputSchoolsign" class="sr-only">School</label>        <input id="inputSchoolsign" class="form-control text-center" style="width: 35%;" placeholder="School" required autofocus> <br>      </center><br>              <center>        <label for="inputEmailsign" class="sr-only">Email address</label>        <input type="email" id="inputEmailsign" class="form-control text-center" style="width: 35%; margin-bottom: 5px;" placeholder="Email address" required autofocus>      </center>      <center>        <label for="inputPasswordsign" class="sr-only">Password</label>        <input type="password" id="inputPasswordsign" class="form-control text-center" style="width: 35%;" placeholder="Password" required>      </center>      <center>        <button class="btn btn-lg btn-secondary btn-block" style="width: 35%; margin-top: 7.5px" type="submit" onclick="generatepass();">Generate</button>      </center><br>      <center>      <div id="errorplacementsignup">       </div>    </center><br>      <center>        <button class="btn btn-lg btn-success btn-block" style="width: 35%;" type="submit" onclick="signup()">Confirm</button>      </center><br>            </form>    </div><script type="text/javascript" src="js/token.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script><link rel="stylesheet" type="text/css" href="css/style.css" /><script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script><script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script><script src="js/bootstrap.min.js"></script><script type="text/javascript" src="js/signup.js"></script>`;
	socket.on('databasebody', function(data) {
		socket.emit('databasebody', databasebodytext);
	});
	socket.on('accountbody', function(data) {
		socket.emit('accountbody', accountbodytext);
	});
	socket.on('signupbody', function(data) {
		socket.emit('signupbody', signupbody);
	});



	socket.on('account-detail-change', function(data) {
		switch (data[0]) {
			case 0:
				var firstnamesource = firebase.database().ref('Users/'+data[1][12]+'/first-name');

				firstnamesource.on('value', async function(snapshot) { 
					var firstname = await snapshot.val();
					var array = [0, firstname]
					socket.emit('account-detail-change', array)
				});

			break;
			case 1:
				var lastnamesource = firebase.database().ref('Users/'+data[1][12]+'/last-name');

				lastnamesource.on('value', async function(snapshot) { 
					var lastname = await snapshot.val();
					var array = [1, lastname]
					socket.emit('account-detail-change', array);
				});	

			break;
			// case 2:
			// 	var schoolnamesource = firebase.database().ref('Users/'+data[1][12]+'/school-name');
		
			// 	schoolnamesource.on('value', async function(snapshot) { 
			// 		var schoolname = await snapshot.val();
			// 		var array = await [2, schoolname]
			// 		socket.emit('account-detail-change', array);
			// 	});	
			// break;
			// case 3:
			// 	var yearlevelsource = firebase.database().ref('Users/'+data[1][12]+'/year-level');
		
			// 	yearlevelsource.on('value', async function(snapshot) { 
			// 		var yearlevel = await snapshot.val();
			// 		var array = await [3, yearlevel]
			// 		socket.emit('account-detail-change', array);
			// 	});	
			// break;
			// case 4:
			// 	var accountypesource = firebase.database().ref('Users/'+data[1][12]+'/account-type');
		
			// 	accountypesource.on('value', async function(snapshot) { 
			// 		var accounttype = await snapshot.val();
			// 		var array = await [4, accounttype]
			// 		socket.emit('account-detail-change', array);
			// 	});	
			// break;
		}		
	});

	socket.on('change-detail', function(data) {
		console.log(data[2][12])
		switch (data[0]) {
			case 0:
				var firstnamesource = firebase.database().ref('Users/'+data[2][12]);
				firstnamesource.update({
					"first-name": data[1]
				});
			break;
			case 1:
				var lastnamesource = firebase.database().ref('Users/'+data[2][12]);
				lastnamesource.update({
					"last-name": data[1]
				});
			break;
			// case 2:
			// 	var schoolnamesource = firebase.database().ref('Users/'+data[2][12]);
			// 	schoolnamesource.update({
			// 		"school-name": data[1]
			// 	});
			// break;
			// case 3:
			// 	var yearlevelsource = firebase.database().ref('Users/'+data[2][12]);
			// 	yearlevelsource.update({
			// 		"year-level": data[1]
			// 	});
			// break;
			// case 4:
			// 	var accounttypesource = firebase.database().ref('Users/'+data[2][12]);
			// 	accounttypesource.update({
			// 		"account-type": data[1]
			// 	});
			// break;
		}
		return 0;
	});

	socket.on('account-detail', async function(data) {
		var firstnamesource = firebase.database().ref('Users/'+data[12]+'/first-name');
		var lastnamesource = firebase.database().ref('Users/'+data[12]+'/last-name');
		var schoolnamesource = firebase.database().ref('Users/'+data[12]+'/school-name');
		var yearlevelsource = firebase.database().ref('Users/'+data[12]+'/year-level');
		var accounttypesource = firebase.database().ref('Users/'+data[12]+'/account-type');
		var nullvalue = firebase.database().ref('Users/'+data[12]+'/nullvalue');
		
		var array = [];

		await firstnamesource.on('value', async function(snapshot) { 
			array.push(snapshot.val());
		});
		await lastnamesource.on('value', async function(snapshot) { 
			array.push(snapshot.val());
		});	
		await schoolnamesource.on('value', async function(snapshot) { 
			array.push(snapshot.val());
		});	
		await yearlevelsource.on('value', async function(snapshot) { 
			array.push(snapshot.val());
		});	
		await accounttypesource.on('value', async function(snapshot) { 
			array.push(snapshot.val());
		});	
		await nullvalue.on('value', async function(snapshot) { 
			socket.emit('account-detail', array);
		});	
	});

	socket.on('resetpassword', function(data) {
		if (data[0] == data[1]) {
			var str = data[0];
			for (var i = 0, len = str.length, count=0, ch; i < len; ++i) {
				ch = str.charAt(i);
				if(ch >= 'A' && ch <= 'Z') ++count;
			}
			if (count >= 1) {
			if (data[0].length > 6) {
				if (/[^a-zA-Z]/.test(data[0])) {
					var userpasswordsource = firebase.database().ref('Users/'+data[2][12]+'/userpassword');
					userpasswordsource.once('value', async function(snapshot) {
						if (data[0] != snapshot.val()) {
							var userpasswordsourceval = firebase.database().ref('Users/'+data[2][12]);
							userpasswordsourceval.update({
								"userpassword": data[0]
							});
							socket.emit('password-success', "password created successfully.");
						} else {
							var error ="password is the same.";
							socket.emit('password-error', error);
						}
					});	
				} else {
					var error = 'Password does not contain numbers'
					return socket.emit('password-error', error);
				}
			} else {
				var error = "password doesn't have enough characters."
				return socket.emit('password-error', error);
			}
			} else {
				var error = "password does not have a capital letter"
				return socket.emit('password-error', error);
			}
		} else {
			var error = "password do not match."
			return socket.emit('password-error', error);	
		}
	})

	socket.on('signout', function(data) {
		databaseurl = 'error';
		socket.emit('signout', 'value');
	});



});



/*
RENDERING PAGES
*/
app.get('/content', async function(req, res) {
	res.render('content');
});

app.get('/database', async function(req, res) {
	res.render('index');
});

app.get('/signup', async function(req, res) {
	res.render('signup');
});

app.get('/account', async function(req, res) {
	res.render('account');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res) {
	res.render('login', { //change to index once finished with login page
		title: 'Name',
	});
});











