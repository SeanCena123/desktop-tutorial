var currentuser = JSON.parse(sessionStorage.getItem("user"));

if (currentuser != null) {
	console.log("user is still logged in.")
	console.log(currentuser);
	
	var socket = io.connect(); 

	socket.emit('connections', 'value');

	function returnfunc() {
		for (var i = 0; i < array.length; i++) {
			array[i].style.backgroundColor = "#00d5a3";
		}
	}	

	var openfile = [1, 1, 1];
	var pageid = document.getElementById("pageid");
	let scrollable = document.getElementById("scrollable");
	let mymymarquee = document.getElementById("mymarquee");  
	let defaultext = document.getElementById("defaultext");
	let placeholder = document.getElementById("placeholder");
	let bold = document.getElementById("bold")
	let resultbanner = document.getElementById("resultbanner");
	let array = [document.getElementById("dropdownMenuButtonsubject"), document.getElementById("dropdownMenuButtonsource"), document.getElementById("dropdownMenuButtonyear"), document.getElementById("dropdownMenuButtonunit"), document.getElementById("dropdownMenuButtontopic")];
	let hoverprinc = document.getElementById("hoverprinc");
	let sourcepaperpdf = document.getElementById("sourcepaperpdf");
	let videohover = document.getElementById("videohover");
	let searchinput = document.getElementById("searchinput");
	let buttonsearch = document.getElementById("buttonsearch"); 
	let dropdownMenuButtonsubject = document.getElementById("dropdownMenuButtonsubject")
	let dropdownMenuButtonsource = document.getElementById("dropdownMenuButtonsource");
	let dropdownMenuButtonyear = document.getElementById("dropdownMenuButtonyear");
	let dropdownMenuButtonunit = document.getElementById("dropdownMenuButtonunit");
	let dropdownMenuButtontopic = document.getElementById("dropdownMenuButtontopic")
	let sourcesolutionpdf = document.getElementById("sourcesolutionpdf");
	let resultsearch = document.getElementById("resultsearch");
	let resultquestionbanner = document.getElementById("resultquestionbanner");
	let sourcewritten = document.getElementById("sourcewritten");
	let topicid = document.getElementById("topicid");
	let resultamount = document.getElementById("resultamount");
	var amountlabel;
	var searchinputvalue;
	var y;
	var z;
	var arrFiltered = [];

	async function searching() {
		resultsearch.innerHTML = '';
		resultamount.innerHTML = '';
		pageid.innerHTML =  '';			
		var searchinputvalue = searchinput.value;
		await socket.emit('searching', searchinputvalue);
	}

	socket.on('searching', async function(data) {
		switch (data[0]) {
			case 0:
				topicid.innerHTML = '';
				filterseperator("None");
				dropdownMenuButtonsubject.innerHTML = "Subject";
		    	dropdownMenuButtonsource.innerHTML = "Source";
		    	dropdownMenuButtonyear.innerHTML = "Year";
		    	dropdownMenuButtonunit.innerHTML = "Unit";
		    	dropdownMenuButtontopic.innerHTML = "Topic";
			break;

			case 1:
				await searchresultnum();
				await paginationarray();
			break;
		}
	});

	var marquee1;
	var div4;
	var bold1;
	async function searchresultnum() {
		await socket.emit('searchresultnum', 'value');
	}
	socket.on('searchresultnum', function(data) {
	   	var div1 = document.createElement("div");
		div1.id = "resultbanner"
		var center1 = document.createElement("center");
		var span1 = document.createElement("span");
		span1.className = "text mb-4"
		span1.style = "margin-left: 20px";
		span1.innerHTML = data+" amount of results"
		var hr1 = document.createElement("hr");
		var br1 = document.createElement("br");

		center1.appendChild(span1);
		center1.appendChild(hr1)
		div1.appendChild(center1);
		resultamount.appendChild(div1);
	});

	async function paginationarray() {
		await socket.emit('paginationarray', 'value')
	}
	socket.on('paginationarray', async function(data) {
		arrFiltered = await data;
		await socket.emit('searchresultpage', 'value');
	});
	socket.on('searchresultpage', function(data) {
		searchresultpage();
	});


	var countnum = 0;
	var pagearr = [];
	var pagenumber = countnum+1;
	var addcount = 0;
	function searchresultpage() {
		var pageid = document.getElementById("pageid");
		var num = [1, 2, 3];
		var nextcount = 3;

		var nav1 = document.createElement("nav");
		nav1.setAttribute('aria-label', '...');

		var ul1 = document.createElement("ul");
		ul1.className = "pagination";
		nav1.appendChild(ul1);

		var li1 = document.createElement("li");
		li1.className = "page-item disabled";
		var a1 = document.createElement("a");
		a1.className = "page-link";
		a1.href = "#";
		a1.tabindex = -1;
		a1.innerHTML = "Previous"
		li1.appendChild(a1); 
		li1.onclick = function () {
			countnum--;

			if (countnum > 0) {
				li1.classList.remove("disabled");

				for (var i = 0; i < num.length; i++) {
					num[i] = num[i]-3;

					switch(i) {
						case 0:
					    	a2.innerHTML = num[i];
							if (num[i] > arrFiltered.length) {
								li2.classList.remove("disabled");
							} 
						break;

						case 1:
						    a3.innerHTML = num[i];
							if (num[i] > arrFiltered.length) {
								li3.classList.remove("disabled");
							} 
					    break;

					  	case 2:
						if (num[i] > arrFiltered.length) {
							li4.classList.remove("disabled");
						} 
					    a4.innerHTML = num[i];
						li2.classList.remove("active");
						li3.classList.remove("active");
						li4.classList.add("active");
						// console.log("we are on page "+num[2]);
						resultsearch.innerHTML = '';
						for (var i = 0; i < num.length; i++) {
							resultsearchpostsearch(num[2], i)
						}
					    break;
					}

				}

			} else {
				countnum = 0;
				li1.classList.add("disabled");
				// console.log(nextcount);

				for (var i = 0; i < num.length; i++) {
					num[i] = i+1; 
				}

				a2.innerHTML = 1;
				a3.innerHTML = 2;
				a4.innerHTML = 3;

				if (nextcount == 3) {
					//return 0;
				} else {
					nextcount -=3;
					li2.classList.remove("active");
					li3.classList.remove("active");
					li4.classList.add("active");
					// console.log("we are on page "+num[2]);
					resultsearch.innerHTML = '';
					for (var i = 0; i < num.length; i++) {
						resultsearchpostsearch(num[2], i)	
					}
				}

				for (var i = 0; i < num.length; i++) {
					switch(i) {
						case 0:
							if (num[i] < arrFiltered.length) {
								li2.classList.remove("disabled");
							} 
					    break;

					  	case 1:
							if (num[i] < arrFiltered.length) {
								li3.classList.remove("disabled");
							} 
					    break;

					  	case 2:
							if (num[i] < arrFiltered.length) {
								li4.classList.remove("disabled");
							} 
					    break;
					}
				}

				if (arrFiltered.length > nextcount) {
					li5.classList.remove("disabled");
				} 

			}

		}


		function resultsearchpostsearch(page, result) {
			var int = page-1;

			if (typeof arrFiltered[int] == 'undefined') {
				// console.log("there is no results for this page.")
			} else {
				// console.log(arrFiltered[int][result])
				var div2  = document.createElement("div");
				div2.className = "d-flex flex-row justify-content-between mb-3";
				div2.id = "scrollable";
				div2.onclick = function () {
					socket.emit('arrayreq', arrFiltered[int][result]);
					window.location.href='/content';
				} 

				var div3 = document.createElement("div")
				div3.className = "d-flex flex-column p-3";
				div3.style = "max-width: 1100px;";

				var p1 = document.createElement("p");
				p1.className = "mb-2 main";
				bold1 = document.createElement("b");
				bold1.id = "bold";
				bold1.innerHTML = arrFiltered[int][result][0];
				bold1.href = "/content";

				var a1 = document.createElement("a");
				a1.style = "color: grey";
				a1.id = "hoverprinc";

				var small1 = document.createElement("small");
				small1.className = "text-muted";

				var div4 = document.createElement("div");
				div4.style = "position: absolute;";
				div4.id = "placeholder";
				div4.innerHTML = arrFiltered[int][result][4];

				var marquee1 = document.createElement("marquee");
				marquee1.id = "mymarquee";
				marquee1.behavior = "scroll";
				marquee1.direction = "left";
				marquee1.scrollAmount = "15";
				marquee1.innerHTML = arrFiltered[int][result][4];

				p1.appendChild(bold1)
				div3.appendChild(p1);
				div3.appendChild(a1)
				a1.appendChild(small1);
				small1.appendChild(div4);
				small1.appendChild(marquee1);
				div2.appendChild(div3);
				resultsearch.appendChild(div2);

				marquee1.stop();
				windowcheckpostsearch(int, result);

				marquee1.style.visibility = "hidden";

				a1.addEventListener("mouseenter", function() { 
					marquee1.style.visibility = "visible";
					div4.style.visibility = "hidden";
					marquee1.start();
				})

				a1.addEventListener("mouseleave", function() { 
					div4.style.visibility = "visible";
					marquee1.style.visibility = "hidden";
					marquee1.stop();
				})

				function windowcheckpostsearch(val1, val2) {
					var x = window.innerWidth;
					if (x >= 993 && x < 1201) {
						if (bold1.innerHTML.length < 76) {
							for (var i = 0; i < (50); i++) {
								bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
							}
						} else if (bold1.innerHTML.length > 76) {
							var variable = bold1.innerHTML.length-(76/2);
							for (var i = 0; i < (50-variable); i++) {
								bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
							}
						}

						if (div4.innerHTML.length > 200) {
							marquee1.style.textIndent = "-85vw";
						} else if (div4.innerHTML.length < 200) {
							marquee1.style.textIndent = "-80vw";
						}

						if (div4.innerHTML.length > 130) {
							var res = div4.innerHTML.slice(0, 130);
							var dot = "..."
							var holdertext = res + dot;
							div4.innerHTML = holdertext;
						} else {
							div4.innerHTML = arrFiltered[val1][val2][4];	
						}

					} else if (x >= 1201) {
						if (bold1.innerHTML.length < 76) {
							for (var i = 0; i < (72); i++) {
								bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
							}
						} else if (bold1.innerHTML.length > 76) {
							var variable = bold1.innerHTML.length-(76);
							for (var i = 0; i < (50-variable); i++) {
								bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
							}
						}

						if (div4.innerHTML.length > 200) {
							marquee1.style.textIndent = "-70vw";
						} else if (div4.innerHTML.length < 200) {
							marquee1.style.textIndent = "-55vw";
						}

						if (div4.innerHTML.length > 170) {
							var res = div4.innerHTML.slice(0, 170);
							var dot = "..."
							var holdertext = res + dot;
							div4.innerHTML = holdertext;
						} else {
							div4.innerHTML = arrFiltered[val1][val2][4];	
						}

					} else {
						if (div4.innerHTML.length > 200) {
							marquee1.style.textIndent = "-70vw";
						} else if (div4.innerHTML.length < 200) {
							marquee1.style.textIndent = "-55vw";
						}

						if (div4.innerHTML.length > 65) {
							var res = div4.innerHTML.slice(0, 65);
							var dot = "..."
							var holdertext = res + dot;
							div4.innerHTML = holdertext;
						} else {
							div4.innerHTML = arrFiltered[val1][val2][4];	
						}

					}
				}
			}
		}

		var li2 = document.createElement("li");
		li2.className = "page-item active";
		var a2 = document.createElement("a");
		a2.className = "page-link";
		a2.href = "#";
		a2.innerHTML = num[0];
		li2.appendChild(a2); 
		li2.onclick = function () {
			if (li2.classList.contains("disabled")) {
				// console.log("this is disabled.");
			} else {
				li2.classList.add("active");
				li3.classList.remove("active");
				li4.classList.remove("active");

				// console.log("we are on page "+num[0]);

				resultsearch.innerHTML = '';
				for (var i = 0; i < num.length; i++) {
					resultsearchpostsearch(num[0], i);
				}
			}
		}

		var li3 = document.createElement("li");
		li3.className = "page-item";
		var a3 = document.createElement("a");
		a3.className = "page-link";
		a3.href = "#";
		a3.innerHTML = num[1];
		li3.appendChild(a3); 
		li3.onclick = function () {
			if (li3.classList.contains("disabled")) {
				// console.log("this is disabled.");
			} else {
				li2.classList.remove("active");
				li3.classList.add("active");
				li4.classList.remove("active");

				// console.log("we are on page "+num[1]);
				resultsearch.innerHTML = '';
				for (var i = 0; i < num.length; i++) {
					resultsearchpostsearch(num[1], i);
				}
			}
		}

		var li4 = document.createElement("li");
		li4.className = "page-item";
		var a4 = document.createElement("a");
		a4.className = "page-link";
		a4.href = "#";
		a4.innerHTML = num[2];
		li4.appendChild(a4); 
		li4.onclick = function () {
			if (li4.classList.contains("disabled")) {
				// console.log("this is disabled.");
			} else {
				li2.classList.remove("active");
				li3.classList.remove("active");
				li4.classList.add("active");

				// console.log("we are on page "+num[2]);
				resultsearch.innerHTML = '';
				for (var i = 0; i < num.length; i++) {
					resultsearchpostsearch(num[2], i);
				}
			}
		}

		if (num[0] > arrFiltered.length) {
			li2.classList.add("disabled");
		} 
		if (num[1] > arrFiltered.length) {
			li3.classList.add("disabled");
		} 
		if (num[2] > arrFiltered.length) {
			li4.classList.add("disabled");
		} 

		var li5 = document.createElement("li");
		li5.className = "page-item";
		var a5 = document.createElement("a");
		a5.className = "page-link";
		a5.href = "#";
		a5.innerHTML = "Next"
		li5.appendChild(a5); 
		li5.onclick = function () {
			if (li5.classList.contains("disabled")) {
				// console.log("this is disabled.");
			} else {
				countnum++;
				addcount +=3;
				// console.log(countnum);
		
				nextcount +=3;

				if (arrFiltered.length <= nextcount) {
					li5.classList.add("disabled");
				} 

				if (countnum > 0) {
					li1.classList.remove("disabled");

					for (var i = 0; i < num.length; i++) {
						num[i] = num[i]+3;

						switch(i) {
						 	case 0:
						    	a2.innerHTML = num[i];
								li2.classList.add("active");
								li3.classList.remove("active");
								li4.classList.remove("active");


								// console.log("we are on page "+num[0]);
								resultsearch.innerHTML = '';
								for (var i = 0; i < num.length; i++) {
									resultsearchpostsearch(num[0], i)
								}

								if (num[i] > arrFiltered.length) {
									li2.classList.add("disabled");
								}
							break;
						  
							case 1:
						    	a3.innerHTML = num[i];

								if (num[i] > arrFiltered.length) {
									li3.classList.add("disabled");
								}

						    break;

							case 2:
						    	a4.innerHTML = num[i];

								if (num[i] > arrFiltered.length) {
									li4.classList.add("disabled");
								}

						    break;
						}
					}

					} else {
						li1.classList.add("disabled");

						for (var i = 0; i < num.length; i++) {
							num[i] = i+1; 
						}

						a2.innerHTML = 1;
						a3.innerHTML = 2;
						a4.innerHTML = 3;

				}
			}
		}

		if (amountlabel == 0) {
			arrFiltered = [];
			li2.classList.remove("active");
			li2.classList.add("disabled");
			li3.classList.add("disabled");
			li4.classList.add("disabled");
			li5.classList.add("disabled");
		}

		if (arrFiltered.length <= nextcount) {
			li5.classList.add("disabled");
		} 

		ul1.appendChild(li1);
		ul1.appendChild(li2);
		ul1.appendChild(li3);
		ul1.appendChild(li4);
		ul1.appendChild(li5);
		pageid.appendChild(nav1);

	} //end of searchresultpage function

	socket.on('resultsearchfunc', function(data) {
		if (data[0] < (data[1]+1)) {
			var div2  = document.createElement("div");
			div2.className = "d-flex flex-row justify-content-between mb-3";
			div2.id = "scrollable";
			div2.onclick = function () {
				socket.emit('arrayreq', data[2]);
				window.location.href='/content';
			} 

			var div3 = document.createElement("div")
			div3.className = "d-flex flex-column p-3";
			div3.style = "max-width: 1100px;";

			var p1 = document.createElement("p");
			p1.className = "mb-2 main";
			bold1 = document.createElement("b");
			bold1.id = "bold";
			bold1.innerHTML = data[2][0];
			bold1.href = "/content";

			var a1 = document.createElement("a");
			a1.style = "color: grey";
			a1.id = "hoverprinc";

			var small1 = document.createElement("small");
			small1.className = "text-muted";

			var div4 = document.createElement("div");
			div4.style = "position: absolute;";
			div4.id = "placeholder";
			div4.innerHTML = data[2][4];

			var marquee1 = document.createElement("marquee");
			marquee1.id = "mymarquee";
			marquee1.behavior = "scroll";
			marquee1.direction = "left";
			marquee1.scrollAmount = "15";
			marquee1.innerHTML = data[2][4];

			p1.appendChild(bold1)
			div3.appendChild(p1);
			div3.appendChild(a1)
			a1.appendChild(small1);
			small1.appendChild(div4);
			small1.appendChild(marquee1);
			div2.appendChild(div3);
			resultsearch.appendChild(div2);

			marquee1.stop();
			windowcheckdefault();

			marquee1.style.visibility = "hidden";

			a1.addEventListener("mouseenter", function() { 
				marquee1.style.visibility = "visible";
				div4.style.visibility = "hidden";
				marquee1.start();
			})

			a1.addEventListener("mouseleave", function() {  
				div4.style.visibility = "visible";
				marquee1.style.visibility = "hidden";
				marquee1.stop();
			})
		}

		function windowcheckdefault() {
			var x = window.innerWidth;
			if (x >= 993 && x < 1201) {
				if (bold1.innerHTML.length < 76) {
					for (var i = 0; i < (50); i++) {
						bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
					}
				} else if (bold1.innerHTML.length > 76) {
					var variable = bold1.innerHTML.length-(76/2);
					for (var i = 0; i < (50-variable); i++) {
						bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
					}
				}

				if (div4.innerHTML.length > 200) {
					marquee1.style.textIndent = "-85vw";
				} else if (div4.innerHTML.length < 200) {
					marquee1.style.textIndent = "-80vw";
				}

				if (div4.innerHTML.length > 130) {
					var res = div4.innerHTML.slice(0, 130);
					var dot = "..."
					var holdertext = res + dot;
					div4.innerHTML = holdertext;
				} else {
					div4.innerHTML = data[2][4];	
				}

			} else if (x >= 1201) {
				if (bold1.innerHTML.length < 76) {
					for (var i = 0; i < (72); i++) {
						bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
					}
				} else if (bold1.innerHTML.length > 76) {
					var variable = bold1.innerHTML.length-(76);
					for (var i = 0; i < (50-variable); i++) {
						bold1.innerHTML +=" ‎‏‏‎ ‎‏‏‎";
					}
				}

				if (div4.innerHTML.length > 200) {
					marquee1.style.textIndent = "-70vw";
				} else if (div4.innerHTML.length < 200) {
					marquee1.style.textIndent = "-55vw";
				}

				if (div4.innerHTML.length > 170) {
					var res = div4.innerHTML.slice(0, 170);
					var dot = "..."
					var holdertext = res + dot;
					div4.innerHTML = holdertext;
				} else {
					div4.innerHTML = data[2][4];	
				}

			} else {
				if (div4.innerHTML.length > 200) {
					marquee1.style.textIndent = "-70vw";
				} else if (div4.innerHTML.length < 200) {
					marquee1.style.textIndent = "-55vw";
				}

				if (div4.innerHTML.length > 65) {
					var res = div4.innerHTML.slice(0, 65);
					var dot = "..."
					var holdertext = res + dot;
					div4.innerHTML = holdertext;
				} else {
					div4.innerHTML = data[2][4];	
				}
			}
		}
	});

	async function loadcontent(num, value) {
		switch (num) { 
			case 0: //loadpdf func
				if (openfile[num] == 1) {
					openfile[num] = 0;
					var data = await [value, 6];
					await socket.emit('loadcontent', data);
				   	await socket.on('loadcontent', function(data) {
						var hr = document.createElement("hr");
						hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
						sourcepaperpdf.appendChild(hr)


						var iframeexam = document.createElement("iframe");
						iframeexam.id = "frameofquestion";
						iframeexam.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
						iframeexam.src = data;		   	
						sourcepaperpdf.appendChild(iframeexam)	
				    });

				} else if (openfile[num] == 0) {
					openfile[num] = 1;
					sourcepaperpdf.innerHTML = ' ';
				}
			break;

			case 1: //loadsolution func
				if (openfile[num] == 1) {
					openfile[num] = 0;
					var data = await [value, 7];
					await socket.emit('loadcontent', data);
				   	await socket.on('loadcontent', function(data) {
						var hr = document.createElement("hr");
						hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
						sourcesolutionpdf.appendChild(hr)

						var iframesolution = document.createElement("iframe")
						iframesolution.id = "frameofquestion";
						iframesolution.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
						iframesolution.src = data;

						sourcesolutionpdf.appendChild(iframesolution)
				   	});
				} else if (openfile[num] == 0) {
					openfile[num] = 1;
					sourcesolutionpdf.innerHTML = ' ';
				}
			break;

			case 2: //loadwrite func
				if (openfile[num] == 1) {
					openfile[num] = 0;
					var data = await [value, 8];
					await socket.emit('loadcontent', data);
				   	await socket.on('loadcontent', function(data) {
					    var p1 = document.createElement("p");
					    p1.style = "margin-left: 20px; font-size: 125%;";
					    p1.innerHTML = variable;
					    sourcewritten.appendChild(p1);

						var script = document.createElement('script');
						script.type = "text/javascript";
					    script.charset = "utf-8";
					    script.src = "js/jqmath-etc-0.4.6.min.js"; 
					    document.getElementsByTagName("head")[0].appendChild(script);
				   	});
				} else if (openfile[num] == 0) {
					openfile[num] = 1;
					sourcewritten.innerHTML = ' ';
				}
			break;
		}
	}


	searchinput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			if (searchinput.value == '') {
				if ((dropdownMenuButtonsubject.innerHTML == 'Subject') && (dropdownMenuButtonsource.innerHTML == 'Source') && (dropdownMenuButtonyear.innerHTML == 'Year') && (dropdownMenuButtonunit.innerHTML == 'Unit') && (dropdownMenuButtontopic.innerHTML == 'Topic')) {
					resultsearch.innerHTML = '';
					pageid.innerHTML = '';
					resultamount.innerHTML = '';
				} else {
					searching();
				}
	  		} else {
				searching();
			}
		}
	});

	function mouseclicksearch() {
		if (searchinput.value == '') {
			if ((dropdownMenuButtonsubject.innerHTML == 'Subject') && (dropdownMenuButtonsource.innerHTML == 'Source') && (dropdownMenuButtonyear.innerHTML == 'Year') && (dropdownMenuButtonunit.innerHTML == 'Unit') && (dropdownMenuButtontopic.innerHTML == 'Topic')) {
				windowcheckdefault();
				resultsearch.innerHTML = '';
				pageid.innerHTML = '';
				resultamount.innerHTML = '';
			} else {
				searching();	
			}
	  	} else {
			searching();
		}
	}

	function dropdowntagfilter(value, id) {
		if (value == "None") {
			switch(id) {
		  		case 0:
			    	dropdownMenuButtonsubject.innerHTML = "Subject";
			    	topicid.innerHTML = '';
				  	filterseperator("None");
		    	break;
		  		case 1:
		    		dropdownMenuButtonsource.innerHTML = "Source";
		    	break;
		  		case 2:
		    		dropdownMenuButtonyear.innerHTML = "Year";
		    	break;
		  		case 3:
		    		dropdownMenuButtonunit.innerHTML = "Unit";
		    	break;
		  		case 4:
		    		dropdownMenuButtontopic.innerHTML = "Topic";
		    	break;
			}	
		} else {
			switch(id) {
		  		case 0:
		  			topicid.innerHTML = '';
		  			dropdownMenuButtonsubject.innerHTML = value;

					switch(value) {
						case "Methods":
			  				filterseperator("None");	
		  				break;
						case "Physics":
					  		filterseperator("None");
				  			filterseperator("Special Relativity");
				  			filterseperator("Wave Theory");		
		  				break;
						case "Chemistry":
			  				filterseperator("None");
		  				break;
						case "Further":
			  				filterseperator("None");
		  				break;
					}

		  			if (searchinput.value == '') {
		    			if (searchinput.value == '') {
							searchinput.value += value;	
						} 
		  			} else {
						searchinput.value += " "+value;
		  			}
		    	break;

		  		case 1:
		  			dropdownMenuButtonsource.innerHTML = value;
		  			if (searchinput.value == '') {
		    			if (searchinput.value == '') {
							searchinput.value += value;	
						} 
		  			} else {
						searchinput.value += " "+value;
		  			}
		    	break;

		  		case 2:
		  			dropdownMenuButtonyear.innerHTML = value;
		  			if (searchinput.value == '') {
		    			if (searchinput.value == '') {
							searchinput.value += value;	
						} 
		  			} else {
						searchinput.value += " "+value;
		  			}
		    	break;

		  		case 3:
		  			dropdownMenuButtonunit.innerHTML = value;
		  			if (searchinput.value == '') {
		    			if (searchinput.value == '') {
							searchinput.value += value;	
						} 
		  			} else {
						searchinput.value += " "+value;
		  			}
		    	break;

		  		case 4:
		  			dropdownMenuButtontopic.innerHTML = value;
		  			if (searchinput.value == '') {
		    			if (searchinput.value == '') {
							searchinput.value += value;	
						} 
		  			} else {
						searchinput.value += " "+value;
		  			}
		    	break;
			}
		}
	}

	socket.on('userdata', function(data) {
		console.log(data);
	});

	var x = JSON.parse(sessionStorage.getItem("user"));
	console.log(x);

	function filterseperator(id) {
		var a = document.createElement("a");
		a.className = "dropdown-item btn-sm";
		a.href = "#";
		a.onclick = function () {
			if (id == "None") {
				dropdownMenuButtontopic.innerHTML = "Topic";
			} else {
				dropdownMenuButtontopic.innerHTML = id;

				if (searchinput.value == '') {
					searchinput.value += id;	
		  		} else {
					searchinput.value += " "+id;
		  		}
			}
		}
		a.innerHTML = id;
		topicid.appendChild(a);
	}
} else {
	console.log("user is not logged in.")
}


