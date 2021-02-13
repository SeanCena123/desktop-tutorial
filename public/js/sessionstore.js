var currentuser = JSON.parse(sessionStorage.getItem("user"));
var databasebody = document.getElementById("databasebody");

if (currentuser != null) {
var sessionstate = localStorage.getItem("searchstate");	
	if (sessionstate != undefined) {
		socket.emit('databasebody', 'value');

		socket.on('databasebody', async function(data) {
			databasebody.innerHTML = await data;

			array = [document.getElementById("dropdownMenuButtonsubject"), document.getElementById("dropdownMenuButtonsource"), document.getElementById("dropdownMenuButtonyear"), document.getElementById("dropdownMenuButtonunit"), document.getElementById("dropdownMenuButtontopic")];
			// openfile = [1, 1, 1];
			pageid = document.getElementById("pageid");
			scrollable = document.getElementById("scrollable");
			mymymarquee = document.getElementById("mymarquee");  
			defaultext = document.getElementById("defaultext");
			placeholder = document.getElementById("placeholder");
			bold = document.getElementById("bold")
			resultbanner = document.getElementById("resultbanner");
			hoverprinc = document.getElementById("hoverprinc");
			sourcepaperpdf = document.getElementById("sourcepaperpdf");
			videohover = document.getElementById("videohover");
			searchinput = document.getElementById("searchinput");
			buttonsearch = document.getElementById("buttonsearch"); 
			dropdownMenuButtonsubject = document.getElementById("dropdownMenuButtonsubject")
			dropdownMenuButtonsource = document.getElementById("dropdownMenuButtonsource");
			dropdownMenuButtonyear = document.getElementById("dropdownMenuButtonyear");
			dropdownMenuButtonunit = document.getElementById("dropdownMenuButtonunit");
			dropdownMenuButtontopic = document.getElementById("dropdownMenuButtontopic");
			sourcesolutionpdf = document.getElementById("sourcesolutionpdf");
			resultsearch = document.getElementById("resultsearch");
			resultquestionbanner = document.getElementById("resultquestionbanner");
			sourcewritten = document.getElementById("sourcewritten");
			topicid = document.getElementById("topicid");
			resultamount = document.getElementById("resultamount");

			countnum = 0;
			pagearr = [];
			pagenumber = countnum+1;
			addcount = 0;

			x = window.innerWidth;

			async function searching() {
				resultsearch.innerHTML = '';
				resultamount.innerHTML = '';
				pageid.innerHTML =  '';			
				var searchinputvalue = searchinput.value;
				await socket.emit('searching', searchinputvalue);
			}	

			searchinput.value = sessionstate;
			searching();

		});	

		localStorage.clear(); 
	} else {
		socket.emit('databasebody', 'value');

		socket.on('databasebody', async function(data) {
			databasebody.innerHTML = await data;

			array = [document.getElementById("dropdownMenuButtonsubject"), document.getElementById("dropdownMenuButtonsource"), document.getElementById("dropdownMenuButtonyear"), document.getElementById("dropdownMenuButtonunit"), document.getElementById("dropdownMenuButtontopic")];
			// openfile = [1, 1, 1];
			pageid = document.getElementById("pageid");
			scrollable = document.getElementById("scrollable");
			mymymarquee = document.getElementById("mymarquee");  
			defaultext = document.getElementById("defaultext");
			placeholder = document.getElementById("placeholder");
			bold = document.getElementById("bold")
			resultbanner = document.getElementById("resultbanner");
			hoverprinc = document.getElementById("hoverprinc");
			sourcepaperpdf = document.getElementById("sourcepaperpdf");
			videohover = document.getElementById("videohover");
			searchinput = document.getElementById("searchinput");
			buttonsearch = document.getElementById("buttonsearch"); 
			dropdownMenuButtonsubject = document.getElementById("dropdownMenuButtonsubject")
			dropdownMenuButtonsource = document.getElementById("dropdownMenuButtonsource");
			dropdownMenuButtonyear = document.getElementById("dropdownMenuButtonyear");
			dropdownMenuButtonunit = document.getElementById("dropdownMenuButtonunit");
			dropdownMenuButtontopic = document.getElementById("dropdownMenuButtontopic");
			sourcesolutionpdf = document.getElementById("sourcesolutionpdf");
			resultsearch = document.getElementById("resultsearch");
			resultquestionbanner = document.getElementById("resultquestionbanner");
			sourcewritten = document.getElementById("sourcewritten");
			topicid = document.getElementById("topicid");
			resultamount = document.getElementById("resultamount");

			countnum = 0;
			pagearr = [];
			pagenumber = countnum+1;
			addcount = 0;

			x = window.innerWidth;

		});	

	}

	// if (sessionstate != undefined) {
	// 	console.log("sessionstate saved.")
	// 	databasebody.innerHTML = sessionstate;
	// } else {
	// 	console.log("sessionstate not saved.")
		// socket.emit('databasebody', 'value');
		// //console.log(sessionstate);

		// socket.on('databasebody', async function(data) {
		// 	databasebody.innerHTML = await data;
			
		// 	array = [document.getElementById("dropdownMenuButtonsubject"), document.getElementById("dropdownMenuButtonsource"), document.getElementById("dropdownMenuButtonyear"), document.getElementById("dropdownMenuButtonunit"), document.getElementById("dropdownMenuButtontopic")];
		// 	// openfile = [1, 1, 1];
		// 	pageid = document.getElementById("pageid");
		// 	scrollable = document.getElementById("scrollable");
		// 	mymymarquee = document.getElementById("mymarquee");  
		// 	defaultext = document.getElementById("defaultext");
		// 	placeholder = document.getElementById("placeholder");
		// 	bold = document.getElementById("bold")
		// 	resultbanner = document.getElementById("resultbanner");
		// 	hoverprinc = document.getElementById("hoverprinc");
		// 	sourcepaperpdf = document.getElementById("sourcepaperpdf");
		// 	videohover = document.getElementById("videohover");
		// 	searchinput = document.getElementById("searchinput");
		// 	buttonsearch = document.getElementById("buttonsearch"); 
		// 	dropdownMenuButtonsubject = document.getElementById("dropdownMenuButtonsubject")
		// 	dropdownMenuButtonsource = document.getElementById("dropdownMenuButtonsource");
		// 	dropdownMenuButtonyear = document.getElementById("dropdownMenuButtonyear");
		// 	dropdownMenuButtonunit = document.getElementById("dropdownMenuButtonunit");
		// 	dropdownMenuButtontopic = document.getElementById("dropdownMenuButtontopic");
		// 	sourcesolutionpdf = document.getElementById("sourcesolutionpdf");
		// 	resultsearch = document.getElementById("resultsearch");
		// 	resultquestionbanner = document.getElementById("resultquestionbanner");
		// 	sourcewritten = document.getElementById("sourcewritten");
		// 	topicid = document.getElementById("topicid");
		// 	resultamount = document.getElementById("resultamount");

		// 	countnum = 0;
		// 	pagearr = [];
		// 	pagenumber = countnum+1;
		// 	addcount = 0;

		// 	x = window.innerWidth;

		// });
	//}
} 

// var enable = 1;

// if (enable = 1) {
// 	localStorage.clear();
// 	enable = 0;
// }
// var sessionstate;
// sessionstate = localStorage.getItem("searchstate");

// if (sessionstate == null) {
// 	console.log(sessionstate)
// } else {
// 	console.log(sessionstate)
// }