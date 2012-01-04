/* ccIndex.js

tjs 091228

file version 1.00 

release version 1.05

*/

function getXMLHTTPRequest() 
{
var req = false;
try 
  {
   req = new XMLHttpRequest(); /* e.g. Firefox */
  } 
catch(err1) 
  {
  try 
    {
     req = new ActiveXObject("Msxml2.XMLHTTP");  /* some versions IE */
    } 
  catch(err2) 
    {
    try 
      {
       req = new ActiveXObject("Microsoft.XMLHTTP");  /* some versions IE */
      } 
      catch(err3) 
        {
         req = false;
        } 
    } 
  }
return req;
}

function requestXMLData(url, responseHandler) {
	myRequest.open("GET", url, true);
	myRequest.onreadystatechange = responseHandler;
	// send the request
	myRequest.send(null);
}

function requestXMLData(myRequest, url, responseHandler) {
	var myRandom=parseInt(Math.random()*99999999);
	//myRequest.open("GET", url, true);
	myRequest.open("GET", url + "&rand=" + myRandom, true);
	myRequest.onreadystatechange = responseHandler;
	// send the request
	myRequest.send(null);
}

function login(loginAccountNumber, lastName, firstName) {
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccLogin.php?account=' + loginAccountNumber + '&first=' + firstName + '&last=' + lastName;
	//alert("login url " + url);
	requestXMLData(loginRequest, url, function() {
	   if(loginRequest.readyState == 4) {
		if(loginRequest.status == 200) {
			//noop
		}
	   }
	});
}

function getLogin() {
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccGetLoginXML.php?account=0';
	requestXMLData(loginRequest, url, function() {
	   if(loginRequest.readyState == 4) {
		   //alert("getLogin loginRequest.readyState " + loginRequest.readyState);
		if(loginRequest.status == 200) {
		   //alert("getLogin loginRequest.status " + loginRequest.status);
		    var data = loginRequest.responseXML;
		    $(data).find('account').each(function() {
			var $account = $(this);
			var accountId = $account.attr('id');
		   //alert("getLogin accountId " + accountId);
			//var children = $account.children();
			//var last = children[0].firstChild.nodeValue;
			//var first = children[1].firstChild.nodeValue;
			//alert("getLogin account " + accountId + " last " + last + " first " + first);
			loginAccountNumber = accountId;
			//lastName = last;
			//firstName = first;
			var elm = document.getElementById('logout');						
			if (loginAccountNumber != 0) {
				elm.disabled="";
			} else {
				elm.disabled="disabled";
			}
		    });
		}
	   }
	});
}

function logout() {
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccLogout.php?account=0';
	//alert("login url " + url);
	requestXMLData(loginRequest, url, function() {
	   if(loginRequest.readyState == 4) {
		if(loginRequest.status == 200) {
			//noop
		}
	   }
	});
}

