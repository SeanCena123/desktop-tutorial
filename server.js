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
    	console.log(data[0]);
    	console.log(data[1]);
    	email = data[0];
    	password = data[1];

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

				    var data = [1, user]
				    console.log("successfully created user.")
				    socket.emit('signupdata', data);
				    // ...

				}).catch((error) => {
				    var errorCode = error.code;
				    var errorMessage = error.message;
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
			await ref.on('value', async function(snapshot) { 
				var totalusers = await snapshot.numChildren(); 

    				for (var i = 1; i < (totalusers+1); i++) {
            			var useremail = await firebase.database().ref('Users/'+i+"/email");
            			var userpassword = await firebase.database().ref('Users/'+i+"/userpassword");

            			
            			await useremail.on('value', async function(snapshot) { 
							if (useremailarr == snapshot.val()) {
								emailvalid = 1;
								console.log("email is correct.")
							} else {
								emailvalid = 0;
								console.log("email is incorrect.")
							}
						});

            			await userpassword.on('value', async function(snapshot) { 
							if (userpasswordarr == snapshot.val()) {
								passwordvalid = 1;
								console.log("password is correct.")
							} else {
								passwordvalid = 0;
								console.log("password is incorrect.")
							}
						});

            			if ((emailvalid == 1) && (passwordvalid == 1)) {
            				console.log("user is able to sign in.")

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

							// var accessToken = firebase.database().ref('Users/'+i+'/accessToken');
							// var apiKey = firebase.database().ref('Users/'+i+'/apiKey');
							// var creationTime = firebase.database().ref('Users/'+i+'/creationTime');
							// var emailuser = firebase.database().ref('Users/'+i+'/email');
							// var emailVerified = firebase.database().ref('Users/'+i+'/emailVerified');
							// var expirationTime = firebase.database().ref('Users/'+i+'/expirationTime');
							// var isAnonymous = firebase.database().ref('Users/'+i+'/isAnonymous');
							// var lastLoginAt = firebase.database().ref('Users/'+i+'/lastLoginAt');
							// var lastSignInTime = firebase.database().ref('Users/'+i+'/lastSignInTime');
							// var refreshToken = firebase.database().ref('Users/'+i+'/refreshToken');
							// var useruid = firebase.database().ref('Users/'+i+'/uid');
							// var userpasswordfir = firebase.database().ref('Users/'+i+'/userpassword');

            				var arruser = [];

            				for (var i = 0; i < firebasekeys.length; i++) {
            					firebasekeys[i].on('value', async function(snapshot) { 
									await arruser.push(snapshot.val());
								});	
            				}

							// accessToken.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// apiKey.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// creationTime.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// emailuser.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// emailVerified.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// expirationTime.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// isAnonymous.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// lastLoginAt.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// lastSignInTime.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// refreshToken.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// useruid.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });
							// userpasswordfir.on('value', async function(snapshot) { 
							// 	arruser.push(snapshot.val());
							// });

            				var data = [1, arruser]
            				// databaseurl = 'index'
            				socket.emit('signInWithEmailAndPassword', data);
						} else {
							console.log("user is unable to sign in.")
							var data = [0, 'error']
							socket.emit('signInWithEmailAndPassword', data);
						}

            				
    				}

			});

    
		// firebase.auth().signInWithEmailAndPassword(email, password)
		//   .then((userCredential) => {
		//     // Signed in 
		//     user = userCredential.user;
		//     databaseurl = 'index'
		//     var data = [1, user];
		//     console.log('successfully signed in.')
		//     socket.emit('signInWithEmailAndPassword', data);

		// 	// firebase.auth().onAuthStateChanged(function(user) {
		// 	//   if (user) {
		// 	//     console.log("success");
		// 	//     socket.emit('loginsuccess', user);
		// 	//   } else {
		// 	//     console.log("failed");
		// 	//   }
		// 	// });
		//   })
		//   .catch((error) => {
		//     var errorCode = error.code;
		//     var errorMessage = error.message;
		//     var data = [0, error.message];
		//     socket.emit('signInWithEmailAndPassword', data);

		//     // ..
		//   });
    });

	socket.on('userdata', function(data) {
		console.log(data);
		socket.emit('userdata', data);
	});


	var databasebodytext = ` <div class="" style="color: #31b08f;">    <h1 class="display-4" style="margin-bottom: -2%"> <b> Viola Education Database </b></h1>    <h1 class="display-10" style="margin-bottom: 7.5%; font-size: 1.1em;"> Enhance your VCE experience by exploring our database for past questions </h1>  </div>  <div class="container d-flex justify-content-center" style="margin-top: -5%;">    <div class="card mt-2 p-4" style="width: 100%;">                <div class="input-group mb-3">           <input id="searchinput" type="text" class="form-control" placeholder="Type your question...">            <div class="input-group-append">              <button class="btn btn-success" id="buttonsearch" onclick="mouseclicksearch()"><i class="fas fa-search"></i>Search</button>            </div>        </div>         <div style="text-align: center; margin-right: 20px">          <div style="display:inline-block;">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonsubject" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Subject</button>                <div class="dropdown-menu dropdown" aria-labelledby="dropdownMenuButton">              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 0)'>None</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Methods", 0)'>Methods</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Physics", 0)'>Physics</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Chemistry", 0)'>Chemistry</a>              <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Further", 0)'>Further</a>            </div>          </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonsource" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Source</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 1)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("VCAA", 1)'>VCAA</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("NHT", 1)'>NHT</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonyear" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Year</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 2)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2019", 2)'>2019</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2018", 2)'>2018</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("2017", 2)'>2017</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtonunit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Unit</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 3)'>None</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Unit 3", 3)'>Unit 3</a>                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("Unit 4", 3)'>Unit 4</a>              </div>           </div>          <div style="display:inline-block">            <button class="btn btn-sm btn-success dropdown-toggle" type="button" id="dropdownMenuButtontopic" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Topic</button>              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="topicid">                <a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("None", 4)'>None</a>              </div>           </div>           <hr>        </div>        <div id="resultamount"> </div>        <div id="resultsearch"> </div>        <br>          <div id="pageid"> </div>    </div>   </div>    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>    <link rel="stylesheet" type="text/css" href="css/style.css" />    <script type="text/javascript" src="js/load.js"></script>     <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script>    <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js"></script>    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>    <script src="js/bootstrap.min.js"></script>`;
	socket.on('databasebody', function(data) {
		socket.emit('databasebody', databasebodytext);
	});

	socket.on('signout', function(data) {
		databaseurl = 'error';
		socket.emit('signout', 'value');
		// firebase.auth().signOut().then(() => {
		// 	databaseurl = 'error';

		// }).catch((error) => {
		//   // An error happened.
		// });
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

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res) {
	res.render('login', { //change to index once finished with login page
		title: 'Name',
	});
});











