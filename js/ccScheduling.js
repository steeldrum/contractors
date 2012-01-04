/* ccScheduling.js

tjs 100517

file version 1.00 

release version 1.24

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
			loginAccountNumber = accountId;
			var elm = document.getElementById('schedules');						
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

function viewSchedules(loginId) {
	//alert("viewProspects loginId " + loginId);
	//100512 deployment options
	//for local tests use http://localhost/webstart/launch.jnlp
	//for deployed site use
	// http://collogistics.com/webstart/launch.jnlp
	//or
	//http://collogistics.selfip.biz/webstart/launch.jnlp
	
	//100519
	//var url = 'http://localhost/webstart/launch.jnlp';
	//var url = 'http://localhost/xml/' + loginId + '/launch.jnlp';
	var url = 'http://collogistics.selfip.biz/xml/' + loginId + '/launch.jnlp';
	window.location.href = url;
	
}

