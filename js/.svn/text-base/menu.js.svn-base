/* menu.js

tjs 101130

file version 1.00 

release version 1.00

*/

//global
	var authenticated = false;
	function getAuthenticated() {
	    if (authenticated) {
			//alert("getAuthenticated authenticated " + authenticated);
	    	return authenticated;
	    } 
			//alert("getAuthenticated authenticated false");
	    return false;
	}

function newLocation(pageName, menuChoice) {
	var newLocation = pageName + ".html?authenticated=" + getAuthenticated() + "#" + menuChoice;
	//.html#collogistics
	//return newLocation;
			//alert("newLocation newLocation " + newLocation);
	window.location.href = newLocation;
}

function setAuthenticated() {
	var args = new ArgumentURL();
	//var authenticated = false;
	authenticated = false;
	try {
		authenticated = args.getArgument('authenticated');
	} 
	catch(err) {
	//ignored
	}
	//alert("setAuthenticated authenticated " + authenticated);
}