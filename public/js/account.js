var socket = io.connect({secure: true}); 
var currentuser = JSON.parse(sessionStorage.getItem("user"));
var accountbody = document.getElementById("accountbody");

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
        socket.emit('accountbody', 'value');

        socket.on('accountbody', async function(data) {
			accountbody.innerHTML = await data;

            var firstname = document.getElementById('first-name');
            var lastname = document.getElementById('last-name');
            var schoolname = document.getElementById('school-name');
            var accounttype = document.getElementById('account-type');
            var yearlevel = document.getElementById('year-level');
            
            
            var resetpasswordtype = document.getElementById('reset-password');
            var resetpasswordretype = document.getElementById('reset-password-retype');
            var errorplacement = document.getElementById('error-placement');

            socket.emit('account-detail', currentuser);


            socket.on('account-detail', function(data) {
                firstname.value = data[0];
                lastname.value = data[1];
                schoolname.value = data[2];
                yearlevel.value = "Year "+data[3];
                accounttype.value = data[4];
            });
            
            firstname.addEventListener("keyup", async function(event) {
                if (event.keyCode === 13) {
                    var array = [0, currentuser]
                    await socket.emit('account-detail-change', array);
                }
            });
            
            lastname.addEventListener("keyup", async function(event) {
                if (event.keyCode === 13) {
                    var array = [1, currentuser]
                    await socket.emit('account-detail-change', array);
                }
            });
            
            schoolname.addEventListener("keyup", async function(event) {
                if (event.keyCode === 13) {
                    var array = await [2, currentuser]
                    await socket.emit('account-detail-change', array);
                }
            });
            
            yearlevel.addEventListener("keyup", async function(event) {
                if (event.keyCode === 13) {
                    var array = await [3, currentuser]
                    await socket.emit('account-detail-change', array);
                }
            });
            
            accounttype.addEventListener("keyup", async function(event) {
                if (event.keyCode === 13) {
                    var array = await [4, currentuser]
                    await socket.emit('account-detail-change', array);
                }
            });
            
            socket.on('account-detail-change', function(data) {
                switch (data[0]) {
                    case 0:
                        if (firstname.value == data[1]) {
                            console.log("data is already the same.")
                        } else {
                            console.log("data can be changed.") 
                            var array = [0, firstname.value, currentuser]
                            socket.emit('change-detail', array)
                        }
                    break;
                    case 1:
                        if (lastname.value == data[1]) {
                            console.log("data is already the same.")
                        } else {
                            console.log("data can be changed.");
                            var array = [1, lastname.value, currentuser]
                            socket.emit('change-detail', array)
                        }
                    break;
                    case 2:
                        if (schoolname.value == data[1]) {
                            console.log("data is already the same.")
                        } else {
                            console.log("data can be changed.")
                            var array = [2, schoolname.value, currentuser]
                            socket.emit('change-detail', array)
                        }
                    break;
                    case 3:
                        if (yearlevel.value == data[1]) {
                            console.log("data is already the same.")
                        } else {
                            console.log("data can be changed.")
                            var array = [2, yearlevel.value, currentuser]
                            socket.emit('change-detail', array)
                        }
                    break;
                    case 4:
                        if (accounttype.value == data[1]) {
                            console.log("data is already the same.")
                        } else {
                            console.log("data can be changed.")
                            var array = [2, accounttype.value, currentuser]
                            socket.emit('change-detail', array)
                        }
                    break; 
                }
            });
            
            function resetpassword() {
                console.log(resetpasswordtype.value);
                console.log(resetpasswordretype.value);
                var data = [resetpasswordtype.value, resetpasswordretype.value, currentuser];
                if (data[0] == '' || data[1] == '') {
                    errorplacement.innerHTML = '';
                } else {
                    socket.emit('resetpassword', data);
                }
            }
            
            socket.on('password-error', function(data) {
                  errorplacement.innerHTML = '';
                  var p1 = document.createElement('p');
                  var b1 = document.createElement('b');
                  
                  p1.style = "color: red; font-size: 13px; margin-top: 10px;";
                  b1.innerHTML = data;
            
                  p1.appendChild(b1);
                  errorplacement.appendChild(p1)
            });
            
            socket.on('password-success', function(data) {
                errorplacement.innerHTML = '';
                var p1 = document.createElement('p');
                var b1 = document.createElement('b');
                
                p1.style = "color: green; font-size: 13px; margin-top: 10px;";
                b1.innerHTML = data;
            
                p1.appendChild(b1);
                errorplacement.appendChild(p1)
            });

        });	

    });
}