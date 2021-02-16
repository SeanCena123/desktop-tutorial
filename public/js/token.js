var socket = io.connect({secure: true}); 

var currentuser = JSON.parse(sessionStorage.getItem("user"));
var currentoken = sessionStorage.getItem("token");
console.log(currentuser);

async function sessionstatefunc() {
	window.location.href = await '/database';
	event.preventDefault()
}

async function accountfunc() {
	window.location.href = await '/account';
	event.preventDefault()
}

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     e.returnValue = '';
//     reloadfunc();
// });

// if (currentuser != null) {
//     if (currentoken == null) {
//         reloadfunc();
//     }
// } 

// async function reloadfunc() {
// 	await socket.emit('tokenverify', currentuser);
// 	socket.on('tokenverify', async function(data) {
// 		await localStorage.setItem("token", data);
// 		currentoken = await localStorage.getItem("token");
// 		console.log(currentoken);
// 	});
// }