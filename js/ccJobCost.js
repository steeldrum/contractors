/* ccJobCost.js

tjs 091104

file version 1.10 

release version 1.14

*/
/*
api references:
http://www.datatables.net/api

*/
function query4CustomerName(id) {
	//var customerName = id;
	var customerInfo = customersDataCacheInfo[id];
	var customerName = customerInfo[0]+ ", " + customerInfo[1];
	return customerName;
}

function query4TypeName(id) {
	var typeInfo = typesDataCacheInfo[id];
	//var typeName = id;
	var typeName = typeInfo[0];
	return typeName;
}

function query4OptionName(id) {
	var optionName = id;
	$('#optionTable tr').each(function(n) {
		var $row = $(this);
		var children = $row.children();
		var rowId = children[0].firstChild.nodeValue;
		//alert("query4OptionName rowId " + rowId);
		if (rowId == id) {
			optionName = children[1].firstChild.nodeValue;
		}
	});
	return optionName;
}

function computeCost(quantity, cost, discount, surcharge) {
	var adjustedCost = Number(cost);
	var disc = Number(discount);
	var surch = Number(surcharge);
		//first determine if discount and/or surchange are percentages (range 0 thru .99)
	if (disc >= 1) { //raw discount
		adjustedCost -= disc;
	} else {
		adjustedCost = adjustedCost - disc*cost;
	}
	if (surch >= 1) { //raw surcharge
		adjustedCost += surch;
	} else {
		adjustedCost = adjustedCost + surch*cost;
	}
	return adjustedCost*quantity;

}

function awaitAjaxProcess(waitForIsDone, callWhenIsDone) {
	//alert("ccJobCost - awaitAjaxProcess isDone " + isDone);
	//if (!isDone) {
		if (waitForIsDone) {
	//if (isDone == false) {
	if (!isDone) {
		//setTimeout( function() { awaitAjaxProcess(); }, 1000 );
		//setTimeout(awaitAjaxProcess, 1000 );
		//setTimeout("awaitAjaxProcess(true, callWhenIsDone)", 500);
 		setTimeout("awaitAjaxProcess(true, " + callWhenIsDone + ")", 500);
            return;
	}
		}
		isDone = false;
	//callWhenIsDone();	
	callWhenIsDone.call();	
	return;
}

function noop() {
	return;
}

function awaitGetDataInfo(waitForIsDone, callWhenIsDone, account, id) {
	//alert("ccJobCost - awaitAjaxProcess isDone " + isDone);
	//if (!isDone) {
		if (waitForIsDone) {
	//if (isDone == false) {
	if (!isInfoDone) {
		alert("ccJobCost awaitGetDataInfo account " + account + " id " + id);
		//setTimeout( function() { awaitAjaxProcess(); }, 1000 );
		//setTimeout(awaitAjaxProcess, 1000 );
		//setTimeout("awaitAjaxProcess(true, callWhenIsDone)", 500);
 		//setTimeout("awaitGetDataInfo(true, " + callWhenIsDone + "," + account + "," + id + ")", 500);
 		setTimeout("awaitGetDataInfo(true, " + callWhenIsDone + "," + account + "," + id + ")", 5000);
		alert("ccJobCost awaitGetDataInfo returning...");
            return;
	}
		}
		isInfoDone = false;
	//callWhenIsDone();	
	//return callWhenIsDone.call(account, id);	
	//callWhenIsDone.call(account, id);	
	//callWhenIsDone.call(callWhenIsDone, account, id);	
	callWhenIsDone.call(null, account, id);	
	return;	
}

//function downloadPDF(jobId) {
function downloadPDF(loginId, jobId) {
	//alert("ccJobCost - downloadPDF loginId " + loginId + " jobId " + jobId);
	var refreshCacheRequest = getXMLHTTPRequest();
	var url = 'ccRefreshCache.php?account=' + loginId + '&jobId=' + jobId;
	requestXMLData(refreshCacheRequest, url, function() {
	//alert("ccJobCost - downloadPDF refreshCacheRequest.readyState " + refreshCacheRequest.readyState);
	   if(refreshCacheRequest.readyState == 4) {
	//alert("ccJobCost - downloadPDF refreshCacheRequest.status " + refreshCacheRequest.status);
		if(refreshCacheRequest.status == 200) {
	//alert("ccJobCost - downloadPDF loginId " + loginId + " jobId " + jobId);
	var url = 'http://localhost/ccJobCost2FPDF.php?account=' + loginId + '&jobId=' + jobId;
	window.location.href = url;
		}
	   }
	});
	//alert("ccJobCost - downloadPDF jobId " + jobId);
	//alert("ccJobCost - downloadPDF loginId " + loginId + " jobId " + jobId);
	//http://localhost/ccJobCost2FPDF.php?account=0&jobId=1
	//var url = 'http://localhost/ccJobCost2FPDF.php?account=' + loginId + '&jobId=' + jobId;
	//window.location.href = url;
}

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

//function refreshAll() {
function refreshAll(tabSelect) {
	
	//customers
	customersDataCacheInfo = [];
	var html;
	$('#customerList').empty();
	var customerRequest = getXMLHTTPRequest();
	var url = 'ccGetCustomersXML.php?account=' + loginAccountNumber;
	//alert("ccJobCost refreshCustomers url " + url);
	requestXMLData(customerRequest, url, function() {
	   if(customerRequest.readyState == 4) {
		// if server HTTP response is "OK"
		//alert("ccJobCost refreshCustomers readyState 4 customerRequest.status " + customerRequest.status);
		if(customerRequest.status == 200) {
		    var data = customerRequest.responseXML;
		    html = '<table id="customerTable"><thead><tr><th>ID</th><th>Last</th><th>First</th><th>Action(<input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		    $(data).find('customer').each(function() {
			var customerInfo = new Array();
			var $customer = $(this);
			html += '<tr>';
			var customerId = $customer.attr('id');
			//html += '<td>' + $customer.attr('id')+ '</td>';
			html += '<td>' + customerId + '</td>';
			var children = $customer.children();
			html += '<td>' + children[0].firstChild.nodeValue + '</td>';
			html += '<td>' + children[1].firstChild.nodeValue + '</td>';
			//html += '<td><input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>&nbsp;<input type="image" onclick="modify(4,' + loginAccountNumber + ',' + customerId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(4,' + loginAccountNumber + ',' + customerId + ')" src="images/delete.gif"/></td>';
			html += '<td><input type="image" onclick="modify(4,' + loginAccountNumber + ',' + customerId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(4,' + loginAccountNumber + ',' + customerId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
			customerInfo.push(children[0].firstChild.nodeValue);
			customerInfo.push(children[1].firstChild.nodeValue);
			customersDataCacheInfo[customerId] = customerInfo;
		    });
		    html += '</tbody></table>';
		    //alert("ccJobCost refreshCustomers html " + html);
		    $('#customerList').append($(html));
		    jQuery('#customerTable').dataTable({
			    bLengthChange: false,
			    sPaginationType: "full_numbers",
			    aoColumns: [{
				    bVisible: true,
				    bSearchable: false,
				    bSortable: false
			    }, //id
			    null, //last
			    {
				    bSortable: false
			    }, //first
			    {
				    bVisible: true,
				    bSearchable: false,
				    bSortable: false
			    } //action
			    ]
		    });
	     
		    //types
		    typesDataCacheInfo = [];
		    var typeRequest = getXMLHTTPRequest();
		    $('#typeList').empty();
		    url = 'ccGetTypesXML.php?account=' + loginAccountNumber;
		    requestXMLData(typeRequest, url, function() {
			if(typeRequest.readyState == 4) {
				// if server HTTP response is "OK"
				if(typeRequest.status == 200) {
					var data = typeRequest.responseXML;
					html = '<table id="typeTable"><thead><tr><th>ID</th><th>Name</th><th>Action(<input type="image" onclick="add(5,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
					$(data).find('type').each(function() {
						var typeInfo = new Array();
						var $type = $(this);
						html += '<tr>';
						var typeId = $type.attr('id');
						html += '<td>' + typeId + '</td>';
						var children = $type.children();
						html += '<td>' + children[0].firstChild.nodeValue + '</td>';
						html += '<td><input type="image" onclick="modify(5,' + loginAccountNumber + ',' + typeId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(5,' + loginAccountNumber + ',' + typeId + ')" src="images/delete.gif"/></td>';
						html += '</tr>';
						typeInfo.push(children[0].firstChild.nodeValue);
						typesDataCacheInfo[typeId] = typeInfo;
					});
					html += '</tbody></table>';
					$('#typeList').append($(html));
					jQuery('#typeTable').dataTable({
					//typeTableReference = jQuery('#typeTable').dataTable({
						bLengthChange: false,
						sPaginationType: "full_numbers",
						aoColumns: [{
							bVisible: true,
							bSearchable: false,
							bSortable: false
						}, //id
						null //name
						]
					});
	     
	//options
	var optionRequest = getXMLHTTPRequest();			
	$('#optionList').empty();
	url = 'ccGetOptionsXML.php?account=' + loginAccountNumber;
	requestXMLData(optionRequest, url, function() {
	   if(optionRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(optionRequest.status == 200) {
		    var data = optionRequest.responseXML;
		    //html = '<table id="optionTable"><thead><tr><th>ID</th><th>Name</th><th>Action(<input type="image" onclick="add(6,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		    html = '<table id="optionTable"><thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead><tbody>';
		    $(data).find('option').each(function() {
			var $option = $(this);
			html += '<tr>';
			var optionId = $option.attr('id');
			html += '<td>' + optionId + '</td>';
			var children = $option.children();
			html += '<td>' + children[0].firstChild.nodeValue + '</td>';					
			html += '<td><input type="image" onclick="modify(6,' + loginAccountNumber + ',' + optionId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(6,' + loginAccountNumber + ',' + optionId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
		    });
		    html += '</tbody></table>';
		    $('#optionList').append($(html));
		    jQuery('#optionTable').dataTable({
			    bLengthChange: false,
			    sPaginationType: "full_numbers",
			    aoColumns: [{
				    bVisible: true,
				    bSearchable: false,
				    bSortable: false
			    }, //id
			    null //name
			    ]
		    });
	     
		    //suppliers
		    suppliersDataCacheInfo = [];
		    var supplierRequest = getXMLHTTPRequest();			
		    $('#supplierList').empty();
		    var url = 'ccGetSuppliersXML.php?account=' + loginAccountNumber;
		    requestXMLData(supplierRequest, url, function() {
			    if(supplierRequest.readyState == 4) {
				    // if server HTTP response is "OK"
				    if(supplierRequest.status == 200) {
					    var data = supplierRequest.responseXML;
					    html = '<table id="supplierTable"><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>URL</th><th>Action(<input type="image" onclick="add(3,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
					    $(data).find('supplier').each(function() {
						    var supplierInfo = new Array();
						    var $supplier = $(this);
						    html += '<tr>';
						    var supplierId = $supplier.attr('id');
						    html += '<td>' + supplierId + '</td>';
						    var supplierChildren = $supplier.children();
						    var supplierChildrenSize = supplierChildren.size();
						    var name;
						    var phone = 'n/a';
						    var url = 'n/a';
						    //var description = partName;
						    for (var i = 0; i < supplierChildrenSize; i++) {
							    var supplierTag = supplierChildren[i].tagName;
							    //alert("ccJobCost parts supplier tag " + supplierTag);
							    if (supplierTag == 'name') {
								    if (supplierChildren[i].firstChild != null)
									    name = supplierChildren[i].firstChild.nodeValue;
							    }
							    else if (supplierTag == 'phone') {
								    if (supplierChildren[i].firstChild != null)
									    phone = supplierChildren[i].firstChild.nodeValue;
							    }
							    else if (supplierTag == 'url') {
								    if (supplierChildren[i].firstChild != null)
									    url = supplierChildren[i].firstChild.nodeValue;
							    }
						    }
						    html += '<td>' + name + '</td>';
						    html += '<td>' + phone + '</td>';
						    html += '<td>' + url + '</td>';
						    html += '<td><input type="image" onclick="modify(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/delete.gif" /></td>';
						    html += '</tr>';
						    supplierInfo.push(name);
						    supplierInfo.push(phone);
						    supplierInfo.push(url);
						    suppliersDataCacheInfo[supplierId] = supplierInfo;
					    });
					    html += '</tbody></table>';
					    $('#supplierList').append($(html));
					    jQuery('#supplierTable').dataTable({
						    bLengthChange: false,
						    sPaginationType: "full_numbers",
						    aoColumns: [{
							    bVisible: true,
							    bSearchable: false,
							    bSortable: false
						    }, //id
						    null, //name
						    {
							    bVisible: true,
							    bSearchable: false,
							    bSortable: false
						    }, //phone
						    {
							    bVisible: true,
							    bSearchable: true,
							    bSortable: false
						    } //url
						    ]
					    });
	     
	     //parts
	     partsDataCacheInfo = [];
	     $('#partList').empty();
	     var partRequest = getXMLHTTPRequest();			

	     url = 'ccGetPartsXML.php?account=' + loginAccountNumber;
	     requestXMLData(partRequest, url, function() {
	    if(partRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(partRequest.status == 200) {
		    var data = partRequest.responseXML;
		    html = '<table id="partTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action(<input type="image" onclick="add(2,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		    var test = false;
		    $(data).find('part').each(function() {
			var partInfo = new Array();
			var $part = $(this);
			html += '<tr>';
			var partId = $part.attr('id');
			html += '<td>' + partId + '</td>';
			var children = $part.children();
			var partName = children[0].firstChild.nodeValue;
			html += '<td>' + partName + '</td>';
			var $supplier = $(children[1]);
			var supplierId = $supplier.attr('id');
			var supplierName = deriveSupplierName(supplierId);
			html += '<td>' + supplierName + '</td>';
			var supplierChildren = $supplier.children();
			var supplierChildrenSize = supplierChildren.size();
			var cost = 0;
			var sku = 'n/a';
			var attributes = 'n/a';
			var description = partName;
			for (var i = 0; i < supplierChildrenSize; i++) {
				var supplierTag = supplierChildren[i].tagName;
				//alert("ccJobCost parts supplier tag " + supplierTag);
				if (supplierTag == 'sku') {
					//sku = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
						sku = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'attributes') {
					//attributes = supplierChildren[i].firstChild.nodeValue;
					if (attributes = supplierChildren[i].firstChild != null)
					attributes = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'description') {
					//description = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
					description = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'cost') {
					cost = supplierChildren[i].firstChild.nodeValue;
				}
			}
			html += '<td>' + sku + '</td>';
			html += '<td>' + attributes + '</td>';
			html += '<td>' + description + '</td>';
			html += '<td>' + cost + '</td>';
			html += '<td><input type="image" onclick="modify(2,' + loginAccountNumber + ',' + partId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(2,' + loginAccountNumber + ',' + partId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
			partInfo.push(partName); // name
			partInfo.push(supplierName); // supplier
			partInfo.push(sku); // sku
			partInfo.push(attributes); // attributes
			partInfo.push(cost); // cost
			partInfo.push(supplierId); // supplierId
			partsDataCacheInfo[partId] = partInfo;		
		});
		html += '</tbody></table>';
		$('#partList').append($(html));
		jQuery('#partTable').dataTable({
			bLengthChange: false,
			sPaginationType: "full_numbers",
			aoColumns: [{
				bVisible: true,
				bSearchable: false,
				bSortable: false
			}, //id
			{
				bVisible: true,
				bSearchable: true,
				bSortable: true
			}, //name
			{
				bVisible: true,
				bSearchable: true,
				bSortable: true
			}, //supplier
			{
				bVisible: true,
				bSearchable: true,
				bSortable: false
			}, //sku
			{
				bVisible: true,
				bSearchable: true,
				bSortable: false
			}, //attributes
			{
				bVisible: true,
				bSearchable: true,
				bSortable: false
			}, //description
			{
				bVisible: true,
				bSearchable: false,
				bSortable: true
			}  //cost
			]
		});
	     
	     //jobs
	var jobRequest = getXMLHTTPRequest();			
	$('#jobList').empty();
	url = 'ccGetJobsXML.php?account=' + loginAccountNumber;
		    //alert("url " + url);
	   requestXMLData(jobRequest, url, function() {
	   if(jobRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(jobRequest.status == 200) {
		    //alert("jobRequest.status == 200");
		    var data = jobRequest.responseXML;
		    var html = '<table id="jobTable"><thead><tr><th>ID</th><th>Customer</th><th>CustomerID</th><th>Type</th><th>TypeID</th><th>Description</th><th>Option</th><th>OptionID</th><th>Material/Service</th><th>Total</th><th style="width: 150px;">Action(<input type="image" onclick="add(1,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
	    $(data).find('job').each(function() {
		var $job = $(this);
		var jobId = $job.attr('id');
		var customerId = $job.attr('customerId');
		var customerName = query4CustomerName(customerId);
		var typeId = $job.attr('typeId');
		var typeName = query4TypeName(typeId);
		var jobChildren = $job.children();
		var description = jobChildren[0].firstChild.nodeValue;
		//alert("jobId " + jobId);
		var options = jobChildren[1];
		$(options).find('option').each(function() {
			html += '<tr>';
			html += '<td>' + jobId + '</td>';
			html += '<td>' + customerName + '</td>';
			html += '<td>' + customerId + '</td>';
			html += '<td>' + typeName + '</td>';
			html += '<td>' + typeId + '</td>';
			html += '<td>' + description + '</td>';
			var $option = $(this);
			var optionId = $option.attr('id');
			var optionName = query4OptionName(optionId);
			html += '<td>' + optionName + '</td>';
			html += '<td>' + optionId + '</td>';
			var selectId = jobId + "_" + optionId;
			var selectHtml = '<select id="' + selectId + '">';
			var total = new Number(0);
		    //alert("option html " + html);
			$($option).find('part').each(function() {
				var $part = $(this);
				var partId = $part.attr('id');
				//var partInfo = query4PartInfoLocal(partId);
				var partInfo = partsDataCacheInfo[partId];
				var partName = partInfo[0];
				var supplierName = partInfo[1];
				//var partSku = partInfo[1];
				//var partCost = partInfo[3];
				var partSku = partInfo[2];
				var partCost = partInfo[4];
				var discount = 0;
				var surcharge = 0;
				var partChildren = $part.children();
				var quantity = 1;
				var partChildrenSize = partChildren.size();
				for (var i = 0; i < partChildrenSize; i++) {
					var partTag = partChildren[i].tagName;
					//alert("ccJobCost jobs part tag " + partTag);
					if (partTag == 'quantity') {
					    if (partChildren[i].firstChild != null)
						quantity = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'sku') {
					    if (partChildren[i].firstChild != null)
						partSku = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'discount') {
					    if (partChildren[i].firstChild != null)
						discount = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'surcharge') {
					    if (partChildren[i].firstChild != null)
						surcharge = partChildren[i].firstChild.nodeValue;
					}
				}
				var qtyPart = quantity + "-" + partName + "(" + partSku + ")";
				
				selectHtml += '<option value="' + partId + '">' + qtyPart + '</option>';
				total += computeCost(quantity, partCost, discount, surcharge);
		//alert("option total " + total);
			});
			selectHtml += '</select>';
			html += '<td>' + selectHtml + '</td><td>' + total + '</td>';
			html += '<td><input type="image" onclick="modify(1,' + loginAccountNumber + ',' + jobId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(1,' + loginAccountNumber + ',' + jobId + ')" src="images/delete.gif"/>&nbsp;<input type="image" onclick="downloadPDF(' + loginAccountNumber + ',' + jobId + ')" src="images/downloadpdfIcon.gif"/></td>';
			html += '</tr>';
		});
	    });
	    html += '</tbody></table>';
		//alert("final html " + html);
	     $('#jobList').append($(html));
	     jQuery('#jobTable').dataTable({
		bLengthChange: false,
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null, //customer
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //customerId
	     null, //type
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //typeId
	     {
	     bSortable: false
	     }, //description
	     {
	     bSortable: false
	     }, //option
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //optionId
	     {
	     bSortable: false
	     }, //part
	     null // total
	     ]
	     });
	     
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + jobRequest.statusText);
		}
	    }
	    
		//tabs			
		$("#tabs").tabs(
		
		//{selected: 0
		{selected: tabSelect
		
		});

	});	     
	     
	     //parts
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + partRequest.statusText);
		}
	    }
	});
	
	
	//suppliers
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + supplierRequest.statusText);
		}
	    }
	});
	
	
	//options
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + optionRequest.statusText);
		}
	    }
	});
	
	//types
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + typeRequest.statusText);
		}
	    }
	});
	
	//customers
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + customerRequest.statusText);
		}
	    }
	});
}

function refreshCustomers() {
	$('#customerList').empty();
	var customerRequest = getXMLHTTPRequest();
	//url = 'ccGetCustomersXML.php?account=' + loginAccountNumber;
	var url = 'ccGetCustomersXML.php?account=' + loginAccountNumber;
	//alert("ccJobCost refreshCustomers url " + url);
	requestXMLData(customerRequest, url, function() {
	   if(customerRequest.readyState == 4) {
		// if server HTTP response is "OK"
	//alert("ccJobCost refreshCustomers readyState 4 customerRequest.status " + customerRequest.status);
		if(customerRequest.status == 200) {
		    var data = customerRequest.responseXML;
		//var html = '<table id="customerTable"><thead><tr><th>ID</th><th>Last</th><th>First</th><th>Action</th></tr></thead><tbody>';
		var html = '<table id="customerTable"><thead><tr><th>ID</th><th>Last</th><th>First</th><th>Action(<input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		$(data).find('customer').each(function() {
		//$(customerData).find('customer').each(function() {
			var $customer = $(this);
			html += '<tr>';
			var customerId = $customer.attr('id');
			//html += '<td>' + $customer.attr('id')+ '</td>';
			html += '<td>' + customerId + '</td>';
			var children = $customer.children();
			html += '<td>' + children[0].firstChild.nodeValue + '</td>';
			html += '<td>' + children[1].firstChild.nodeValue + '</td>';
			//html += '<td><input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>&nbsp;<input type="image" onclick="modify(4,' + loginAccountNumber + ',' + customerId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(4,' + loginAccountNumber + ',' + customerId + ')" src="images/delete.gif"/></td>';
			html += '<td><input type="image" onclick="modify(4,' + loginAccountNumber + ',' + customerId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(4,' + loginAccountNumber + ',' + customerId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
		});
		html += '</tbody></table>';
	//alert("ccJobCost refreshCustomers html " + html);
		$('#customerList').append($(html));
		jQuery('#customerTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null, //last
	     {
	     bSortable: false
	     }, //first
	     {
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     } //action
	     ]
	     });
	     isDone = true;
	
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + customerRequest.statusText);
		}
	    }
	});
}

function refreshTypes() {
	var typeRequest = getXMLHTTPRequest();
	$('#typeList').empty();
	//isDone = false;
	url = 'ccGetTypesXML.php?account=' + loginAccountNumber;
	requestXMLData(typeRequest, url, function() {
	   if(typeRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(typeRequest.status == 200) {
		    var data = typeRequest.responseXML;
		//var html = '<table id="typeTable"><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody>';
		var html = '<table id="typeTable"><thead><tr><th>ID</th><th>Name</th><th>Action(<input type="image" onclick="add(5,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
//var html = '<table id="customerTable"><thead><tr><th>ID</th><th>Last</th><th>First</th><th>Action(<input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		$(data).find('type').each(function() {
			var $type = $(this);
			html += '<tr>';
			var typeId = $type.attr('id');
			//html += '<td>' + $type.attr('id')+ '</td>';
			html += '<td>' + typeId + '</td>';
			var children = $type.children();
			html += '<td>' + children[0].firstChild.nodeValue + '</td>';
			html += '<td><input type="image" onclick="modify(5,' + loginAccountNumber + ',' + typeId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(5,' + loginAccountNumber + ',' + typeId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
		});
		html += '</tbody></table>';
		$('#typeList').append($(html));
		jQuery('#typeTable').dataTable({
		//typeTableReference = jQuery('#typeTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null //name
	     ]
	     });
	     isDone = true;
	
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + typeRequest.statusText);
		}
	    }
	});
}

function refreshOptions() {
	var optionRequest = getXMLHTTPRequest();			
	$('#optionList').empty();
	//isDone = false;
	//var url = 'ccGetOptionsXML.php';
	url = 'ccGetOptionsXML.php?account=' + loginAccountNumber;
	requestXMLData(optionRequest, url, function() {
	   if(optionRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(optionRequest.status == 200) {
		    var data = optionRequest.responseXML;
		//var html = '<table id="optionTable"><thead><tr><th>ID</th><th>Name</th><th>Action(<input type="image" onclick="add(6,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		var html = '<table id="optionTable"><thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead><tbody>';
//var html = '<table id="customerTable"><thead><tr><th>ID</th><th>Last</th><th>First</th><th>Action(<input type="image" onclick="add(4,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		$(data).find('option').each(function() {
			var $option = $(this);
			html += '<tr>';
			var optionId = $option.attr('id');
			html += '<td>' + optionId + '</td>';
			var children = $option.children();
			html += '<td>' + children[0].firstChild.nodeValue + '</td>';					
			html += '<td><input type="image" onclick="modify(6,' + loginAccountNumber + ',' + optionId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(6,' + loginAccountNumber + ',' + optionId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
		});
		html += '</tbody></table>';
		$('#optionList').append($(html));
		jQuery('#optionTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null //name
	     ]
	     });
	     isDone = true;
	
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + optionRequest.statusText);
		}
	    }
	});
}

function refreshSuppliers() {
	var supplierRequest = getXMLHTTPRequest();			
	$('#supplierList').empty();
	var url = 'ccGetSuppliersXML.php?account=' + loginAccountNumber;
	requestXMLData(supplierRequest, url, function() {
	   if(supplierRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(supplierRequest.status == 200) {
		    var data = supplierRequest.responseXML;
		var html = '<table id="supplierTable"><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>URL</th><th>Action(<input type="image" onclick="add(3,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		$(data).find('supplier').each(function() {
			var $supplier = $(this);
			html += '<tr>';
			var supplierId = $supplier.attr('id');
			html += '<td>' + supplierId + '</td>';
			//var $supplier = $(children[1]);
			//var supplierId = $supplier.attr('id');
			//html += '<td>' + supplierId + '</td>';
			var supplierChildren = $supplier.children();
			var supplierChildrenSize = supplierChildren.size();
			//if (test == false) {
			//	alert("ccJobCost parts supplier id " + supplierId + " children size" + supplierChildrenSize);
			//	test = true;
			//}
			var name;
			var phone = 'n/a';
			var url = 'n/a';
			//var description = partName;
			for (var i = 0; i < supplierChildrenSize; i++) {
				var supplierTag = supplierChildren[i].tagName;
				//alert("ccJobCost parts supplier tag " + supplierTag);
				if (supplierTag == 'name') {
					//sku = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
						name = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'phone') {
					//attributes = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
					phone = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'url') {
					//description = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
					url = supplierChildren[i].firstChild.nodeValue;
				}
				//else if (supplierTag == 'cost') {
				//	cost = supplierChildren[i].firstChild.nodeValue;
				//}
			}
			html += '<td>' + name + '</td>';
			html += '<td>' + phone + '</td>';
			html += '<td>' + url + '</td>';
			//html += '<td>' + cost + '</td>';

			//var children = $supplier.children();
			//html += '<td>' + children[0].firstChild.nodeValue + '</td>';					
			//html += '<td>' + children[1].firstChild.nodeValue + '</td>';					
			//html += '<td>' + children[2].firstChild.nodeValue + '</td>';					
			html += '<td><input type="image" onclick="modify(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/delete.gif"/></td>';
			html += '</tr>';
		});
		html += '</tbody></table>';
		$('#supplierList').append($(html));
		jQuery('#supplierTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null, //name
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //phone
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     } //url
	     ]
	     });
	     isDone = true;
	
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + supplierRequest.statusText);
		}
	    }
	});
}

function refreshParts(listType) {
	if (!listType) {
		listType = 0;
	}
	var partRequest = getXMLHTTPRequest();			
	//isDone = false;
	switch (listType) {
		case 1:	// basicPickList
		$('#basicPickList').empty();
		break;
		case 2:	// standardPickList
		$('#standardPickList').empty();
		break;
		case 3:	// premiumPickList
		$('#premiumPickList').empty();
		break;
		default:
		case 0:	// partList
		$('#partList').empty();
		break;		
	}
	url = 'ccGetPartsXML.php?account=' + loginAccountNumber;
	requestXMLData(partRequest, url, function() {
	   if(partRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(partRequest.status == 200) {
		    var data = partRequest.responseXML;
		//var html = '<table id="partTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th></tr></thead><tbody>';
		    var html;
			switch (listType) {
				case 1:	// basicPickList
			    html = '<table id="basicPickTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action</th></tr></thead><tbody>';
				break;
				case 2:	// standardPickList
			    html = '<table id="standardPickTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action</th></tr></thead><tbody>';
				break;
				case 3:	// premiumPickList
			    html = '<table id="premiumPickTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action</th></tr></thead><tbody>';
				break;
				default:
				case 0:	// partList
			    html = '<table id="partTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action(<input type="image" onclick="add(2,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
				break;		
			}
		var test = false;
		$(data).find('part').each(function() {
			var $part = $(this);
			html += '<tr>';
			var partId = $part.attr('id');
			//html += '<td>' + $part.attr('id')+ '</td>';
			html += '<td>' + partId + '</td>';
			var children = $part.children();
			var partName = children[0].firstChild.nodeValue;
			html += '<td>' + partName + '</td>';
			var $supplier = $(children[1]);
			var supplierId = $supplier.attr('id');
			var supplierName = deriveSupplierName(supplierId);
			//html += '<td>' + supplierId + '</td>';
			html += '<td>' + supplierName + '</td>';
			var supplierChildren = $supplier.children();
			var supplierChildrenSize = supplierChildren.size();
			//if (test == false) {
			//	alert("ccJobCost parts supplier id " + supplierId + " children size" + supplierChildrenSize);
			//	test = true;
			//}
			var cost = 0;
			var sku = 'n/a';
			var attributes = 'n/a';
			var description = partName;
			for (var i = 0; i < supplierChildrenSize; i++) {
				var supplierTag = supplierChildren[i].tagName;
				//alert("ccJobCost parts supplier tag " + supplierTag);
				if (supplierTag == 'sku') {
					//sku = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
						sku = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'attributes') {
					//attributes = supplierChildren[i].firstChild.nodeValue;
					if (attributes = supplierChildren[i].firstChild != null)
					attributes = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'description') {
					//description = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
					description = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'cost') {
					cost = supplierChildren[i].firstChild.nodeValue;
				}
			}
			html += '<td>' + sku + '</td>';
			html += '<td>' + attributes + '</td>';
			html += '<td>' + description + '</td>';
			html += '<td>' + cost + '</td>';
			switch (listType) {
				case 1:	// basicPickList
			    html += '<td><input type="image" onclick="append(1,' + loginAccountNumber + ',' + partId + ')" src="images/icon_plus.gif"/></td>';
				break;
				case 2:	// standardPickList
			    html += '<td><input type="image" onclick="append(2,' + loginAccountNumber + ',' + partId + ')" src="images/icon_plus.gif"/></td>';
				break;
				case 3:	// premiumPickList
			    html += '<td><input type="image" onclick="append(3,' + loginAccountNumber + ',' + partId + ')" src="images/icon_plus.gif"/></td>';
				break;
				default:
				case 0:	// partList
			    html += '<td><input type="image" onclick="modify(2,' + loginAccountNumber + ',' + partId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(2,' + loginAccountNumber + ',' + partId + ')" src="images/delete.gif"/></td>';
				break;		
			}
			html += '</tr>';
		});
		html += '</tbody></table>';
			switch (listType) {
				case 1:	// basicPickList
		$('#basicPickList').append($(html));
		jQuery('#basicPickTable').dataTable({
		//basicPartsTable = jQuery('#basicPickTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //name
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //supplier
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //sku
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //attributes
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //description
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: true
	     }  //cost
	     ]
	     });				break;
				case 2:	// standardPickList
		$('#standardPickList').append($(html));
		jQuery('#standardPickTable').dataTable({
		//standardPartsTable = jQuery('#standardPickTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //name
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //supplier
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //sku
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //attributes
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //description
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: true
	     }  //cost
	     ]
	     });				break;
				case 3:	// premiumPickList
		$('#premiumPickList').append($(html));
		jQuery('#premiumPickTable').dataTable({
		//premiumPartsTable = jQuery('#premiumPickTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //name
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //supplier
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //sku
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //attributes
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //description
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: true
	     }  //cost
	     ]
	     });				break;
				default:
				case 0:	// partList
				//"bLengthChange": false
				//"sPaginationType": "full_numbers"
		$('#partList').append($(html));
		jQuery('#partTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //name
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: true
	     }, //supplier
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //sku
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //attributes
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: true,
	     bSortable: false
	     }, //description
	     {
	     //bVisible: false,
	     bVisible: true,
	     bSearchable: false,
	     bSortable: true
	     }  //cost
	     ]
	     });
	     isDone = true;
	     break;		
			}

		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + partRequest.statusText);
		}
	    }
	});
}

function refreshJobs() {
	var jobRequest = getXMLHTTPRequest();			
	//isDone = false;
	$('#jobList').empty();
	url = 'ccGetJobsXML.php?account=' + loginAccountNumber;
	requestXMLData(jobRequest, url, function() {
	   if(jobRequest.readyState == 4) {
		// if server HTTP response is "OK"
		if(jobRequest.status == 200) {
		    var data = jobRequest.responseXML;
					    var html = '<table id="jobTable"><thead><tr><th>ID</th><th>Customer</th><th>CustomerID</th><th>Type</th><th>TypeID</th><th>Description</th><th>Option</th><th>OptionID</th><th>Material/Service</th><th>Total</th><th>Action(<input type="image" onclick="add(1,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
	    $(data).find('job').each(function() {
		var $job = $(this);
		var jobId = $job.attr('id');
		var customerId = $job.attr('customerId');
		var customerName = query4CustomerName(customerId);
		//var customerName = query4CustomerName(customerId, customerData);
		var typeId = $job.attr('typeId');
		var typeName = query4TypeName(typeId);
		var jobChildren = $job.children();
		var description = jobChildren[0].firstChild.nodeValue;
		var options = jobChildren[1];
		$(options).find('option').each(function() {
			html += '<tr>';
			html += '<td>' + jobId + '</td>';
			html += '<td>' + customerName + '</td>';
			html += '<td>' + customerId + '</td>';
			html += '<td>' + typeName + '</td>';
			html += '<td>' + typeId + '</td>';
			html += '<td>' + description + '</td>';
			var $option = $(this);
			var optionId = $option.attr('id');
			var optionName = query4OptionName(optionId);
			html += '<td>' + optionName + '</td>';
			html += '<td>' + optionId + '</td>';
			var selectId = jobId + "_" + optionId;
			var selectHtml = '<select id="' + selectId + '">';
			var total = new Number(0);
			$($option).find('part').each(function() {
				var $part = $(this);
				var partId = $part.attr('id');
				//var partInfo = query4PartInfo(partId);
				//var partInfo = query4PartInfoLocal(partId);
				var partInfo = partsDataCacheInfo[partId];
		//isInfoDone = true;
		//awaitGetDataInfo(true, query4PartInfo, loginAccountNumber, partId);
		//awaitGetDataInfo(true, noop, 0, 0);
	//alert("ccJobCost append info length " + info.length);
	//alert("ccJobCost append info length " + dataInfo.length);
				
				//var partName = query4PartName(partId);
				var partName = partInfo[0];
				var supplierName = partInfo[1];
				//var partSku = partInfo[1];
				//var partCost = partInfo[3];
				var partSku = partInfo[2];
				var partCost = partInfo[4];
				/*var partName = dataInfo[0];
				var partSku = dataInfo[1];
				var partCost = dataInfo[3];*/
				var discount = 0;
				var surcharge = 0;
				var partChildren = $part.children();
				var quantity = 1;
				//if (partChildren) {
				//if (partChildren.size() > 0) {
				//	quantity = partChildren[0].firstChild.nodeValue;
				//}
				var partChildrenSize = partChildren.size();
				for (var i = 0; i < partChildrenSize; i++) {
					var partTag = partChildren[i].tagName;
					//alert("ccJobCost jobs part tag " + partTag);
					if (partTag == 'quantity') {
					    if (partChildren[i].firstChild != null)
						quantity = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'sku') {
					    if (partChildren[i].firstChild != null)
						partSku = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'discount') {
					    if (partChildren[i].firstChild != null)
						discount = partChildren[i].firstChild.nodeValue;
					} else if (partTag == 'surcharge') {
					    if (partChildren[i].firstChild != null)
						surcharge = partChildren[i].firstChild.nodeValue;
					}
				}
				//var qtyPart = quantity + "-" + partName;
				var qtyPart = quantity + "-" + partName + "(" + partSku + ")";
				
				selectHtml += '<option value="' + partId + '">' + qtyPart + '</option>';
				//total += query4PartCost(partId);
				//total += query4PartCost(partId, quantity);
				total += computeCost(quantity, partCost, discount, surcharge);
			});
			selectHtml += '</select>';
			html += '<td>' + selectHtml + '</td><td>' + total + '</td>';
			html += '<td><input type="image" onclick="modify(1,' + loginAccountNumber + ',' + jobId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(1,' + loginAccountNumber + ',' + jobId + ')" src="images/delete.gif"/>&nbsp;<input type="image" onclick="downloadPDF(' + loginAccountNumber + ',' + jobId + ')" src="images/downloadpdfIcon.gif"/></td>';
			html += '</tr>';
		});
		//html += '</tr>';
	    });
	    html += '</tbody></table>';
	     $('#jobList').append($(html));
	     jQuery('#jobTable').dataTable({
		bLengthChange: false,
		//sPaginationType: "two_button",
		sPaginationType: "full_numbers",
	     aoColumns: [{
	     //bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //id
	     null, //customer
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //customerId
	     null, //type
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //typeId
	     {
	     bSortable: false
	     }, //description
	     {
	     bSortable: false
	     }, //option
	     {
	     bVisible: false,
	     bSearchable: false,
	     bSortable: false
	     }, //optionId
	     {
	     bSortable: false
	     }, //part
	     null // total
	     ]
	     });
	     isDone = true;
	     
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + jobRequest.statusText);
		}
	    }
	    
				//tabs			

		$("#tabs").tabs(
		
		{selected: 0
		
		});

	});
}

function add(tabId, account) {
	//alert("ccJobCost add tabId " + tabId + " account " + account);
	//if (lastName == 'collaborator') {
	//	alert ("Adds NOT ALLOWED unless logged in collaborator!");
	//	return;
	//}
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccGetLoginXML.php?account=' + account;
	//alert("ccJobCost modify tabId " + tabId + " account " + account + " id " + id + " url " + url);
	requestXMLData(loginRequest, url, function() {
		//alert("ccJobCost loginRequest.readyState " + loginRequest.readyState);
	   if(loginRequest.readyState == 4) {
		//alert("ccJobCost loginRequest.status " + loginRequest.status);
		if(loginRequest.status == 200) {
		    var data = loginRequest.responseXML;
		    $(data).find('account').each(function() {
			var $account = $(this);
			var accountId = $account.attr('id');
			//var children = $account.children();
			//var last = children[0].firstChild.nodeValue;
			//var first = children[1].firstChild.nodeValue;
			//alert("getLogin account " + accountId + " last "Ê+ last + " first " + first);
			//alert("getLogin accountId " + accountId);
			loginAccountNumber = accountId;
			//lastName = last;
			//firstName = first;
			//alert("ccJobCost modify tabId " + tabId + " account " + loginAccountNumber + " id " + id + " lastName " + lastName);
			//if (lastName == 'collaborator') {
			if (loginAccountNumber == 0) {
				alert ("Adds NOT ALLOWED unless logged in collaborator!");
				return;
			}
	//open the dialog
	switch(tabId) {
		case 1:	//job
			document.jobForm.id.value = 0;
			document.jobForm.remove.value = false;
			document.jobForm.type.innerHTML = deriveTypeSelections(account, 0);
			document.jobForm.customer.innerHTML = deriveCustomerSelections(account, 0);
			$('#basicPartsList').empty();
			$('#standardPartsList').empty();
			$('#premiumPartsList').empty();
			var html1 = '<table id="basicPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>';
			//var html1 = '<table id="basicPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th width="40px;">SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>';
			var html2 = '<table id="standardPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>';
			var html3 = '<table id="premiumPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>';
			$('#basicPartsList').append($(html1));
			$('#standardPartsList').append($(html2));
			$('#premiumPartsList').append($(html3));
			basicPartsTable = jQuery('#basicPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
			standardPartsTable = jQuery('#standardPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
			premiumPartsTable = jQuery('#premiumPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
			//todo setup event handlers to recalculate if qty, disc or surch changed
			//jQuery('#standardPartsTable tbody tr td:nth-child(5)').bind('change', function() {
			//jQuery('#standardPartsTable tbody tr td:nth-child(5)').bind('click', function() {
			//jQuery('#standardPartsTable tbody td:nth-child(5)').bind('click', function() {
				//alert("ccJobCost add");
				//var qty = this;
				//var val = qty.value;
				//alert("add qty changed value " + val);
			//});
			/*
				$( standardPartsTable.fnGetNodes() ).tooltip( {
		"delay": 0,
		"track": true,
		"fade": 250
	} );
*/
/*
var nodes = $( standardPartsTable.fnGetNodes() );
//alert("ccJobCost nodes length " + nodes.length());
alert("ccJobCost nodes length " + nodes.length);
*/
			refreshParts(1);
			refreshParts(2);
			refreshParts(3);
			$("#jobTabs").tabs(
			
			{selected: 0
			
			});
			isJobCreateMode = true;			
			$("#jobDialog").dialog("open");
			break;
		case 2:	//part
			document.partForm.id.value = 0;
			document.partForm.remove.value = false;
			//document.partForm.supplier.innerHTML = deriveSupplierSelections(account);
			document.partForm.supplier.innerHTML = deriveSupplierSelections(account, 0);
			$("#partDialog").dialog("open");
			break;
		case 3:	//supplier
			document.supplierForm.id.value = 0;
			document.supplierForm.remove.value = false;
			//document.supplierForm.supplier.innerHTML = deriveSupplierSelections(account);
			$("#supplierDialog").dialog("open");
			break;
		case 4:	//customer
			document.customerForm.id.value = 0;
			document.customerForm.remove.value = false;
			$("#customerDialog").dialog("open");
			break;
		case 5:	//type
			document.typeForm.id.value = 0;
			document.typeForm.remove.value = false;
			$("#typeDialog").dialog("open");
			break;
		case 6:	//option
			document.optionForm.id.value = 0;
			document.optionForm.remove.value = false;
			$("#optionDialog").dialog("open");
			break;
		case 7:	//job option's part
		//todo datatable append row
			//document.jobOptionForm.id.value = 0;
			//document.jobOptionForm.remove.value = false;
			//$("#jobOptionDialog").dialog("open");
			break;
		default:			
	}
	//alert("ccJobCost add done for tabId " + tabId);


		    });
		}
	   }
	});	
}

function modify(tabId, account, id) {
	//alert("ccJobCost modify tabId " + tabId + " account " + account + " id " + id);
	//if (lastName == 'collaborator') {
		////alert ("Edits NOT ALLOWED unless logged in collaborator!");
		//return;
	//}
	var displayMessage = false;
	//populate(tabId, account, id, displayMessage);
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccGetLoginXML.php?account=' + account;
	//alert("ccJobCost modify tabId " + tabId + " account " + account + " id " + id + " url " + url);
	requestXMLData(loginRequest, url, function() {
		//alert("ccJobCost loginRequest.readyState " + loginRequest.readyState);
	   if(loginRequest.readyState == 4) {
		//alert("ccJobCost loginRequest.status " + loginRequest.status);
		if(loginRequest.status == 200) {
		    var data = loginRequest.responseXML;
		    $(data).find('account').each(function() {
			var $account = $(this);
			var accountId = $account.attr('id');
			//var children = $account.children();
			//var last = children[0].firstChild.nodeValue;
			//var first = children[1].firstChild.nodeValue;
			//alert("getLogin account " + accountId + " last "Ê+ last + " first " + first);
			//alert("getLogin accountId " + accountId);
			loginAccountNumber = accountId;
			//lastName = last;
			//firstName = first;
			//alert("ccJobCost modify tabId " + tabId + " account " + loginAccountNumber + " id " + id + " lastName " + lastName);
			//if (lastName == 'collaborator') {
			if (loginAccountNumber == 0) {
				alert ("Edits NOT ALLOWED unless logged in collaborator!");
				return;
			}
			isJobCreateMode = false;			
			populate(tabId, loginAccountNumber, id, displayMessage);
		    });
		}
	   }
	});	
}

function remove(tabId, account, id) {
	//alert("ccJobCost remove tabId " + tabId + " account " + account + " id " + id);
	//if (lastName == 'collaborator') {
	//	alert ("Deletes NOT ALLOWED unless logged in collaborator!");
	//	return;
	//}
	if (tabId == 6) {
		alert("WARNING: options must be removed by Collaborator Coordinator!");
		return;
	}
	var displayMessage = true;
	//populate(tabId, account, id, displayMessage);
	var loginRequest = getXMLHTTPRequest();
	var url = 'ccGetLoginXML.php?account=' + account;
	//alert("ccJobCost modify tabId " + tabId + " account " + account + " id " + id + " url " + url);
	requestXMLData(loginRequest, url, function() {
		//alert("ccJobCost loginRequest.readyState " + loginRequest.readyState);
	   if(loginRequest.readyState == 4) {
		//alert("ccJobCost loginRequest.status " + loginRequest.status);
		if(loginRequest.status == 200) {
		    var data = loginRequest.responseXML;
		    $(data).find('account').each(function() {
			var $account = $(this);
			var accountId = $account.attr('id');
			//alert("getLogin accountId " + accountId);
			loginAccountNumber = accountId;
			if (loginAccountNumber == 0) {
				alert ("Deletes NOT ALLOWED unless logged in collaborator!");
				return;
			}
			populate(tabId, loginAccountNumber, id, displayMessage);
		    });
		}
	   }
	});	
}

function populate(tabId, account, id, displayMessage) {
	var optionIds = deriveOptionIds();

		//search table and populate first/last name, hidden id and set hidden boolean
//(possible unhide for dialog do you really want to delete).
	var queryStr;
	//       var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";

	switch(tabId) {
		case 1:	//job
			//document.jobForm.id.value = 0;
			//document.jobForm.remove.value = false;
			//document.jobForm.remove.value = displayMessage;
			//var typeId;
			//var customerId;
			//var description;
			var html1 = '<table id="basicPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody>';
			var html2 = '<table id="standardPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody>';
			var html3 = '<table id="premiumPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody>';
			var rowHtml;
			var supplierHtml;
				     //jobs
			var jobRequest = getXMLHTTPRequest();			
	//$('#jobList').empty();
			url = 'ccGetJobsXML.php?account=' + loginAccountNumber;
			requestXMLData(jobRequest, url, function() {
				if(jobRequest.readyState == 4) {
		// if server HTTP response is "OK"
					if(jobRequest.status == 200) {
						var data = jobRequest.responseXML;
		    //var html = '<table id="jobTable"><thead><tr><th>ID</th><th>Customer</th><th>CustomerID</th><th>Type</th><th>TypeID</th><th>Description</th><th>Option</th><th>OptionID</th><th>Material/Service</th><th>Total</th><th style="width: 150px;">Action(<input type="image" onclick="add(1,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
		    				$(data).find('job').each(function() {
							var $job = $(this);
							var jobId = $job.attr('id');
							if (jobId == id) {
								var customerId = $job.attr('customerId');
			//var customerName = query4CustomerName(customerId);
								var customerOptions = deriveCustomerSelections(account, customerId);
								var typeId = $job.attr('typeId');
			//var typeName = query4TypeName(typeId);
								var typeOptions = deriveTypeSelections(account, typeId);
								var jobChildren = $job.children();
								var description = jobChildren[0].firstChild.nodeValue;
								//var $part = $(this);
								var partId;
								//var partInfo = query4PartInfoLocal(partId);
								var partName;
								var partSku;
								var partCost;
								var discount;
								var surcharge;
								//var partChildren = $part.children();
								var quantity;
								
								document.jobForm.type.innerHTML = typeOptions;
								document.jobForm.customer.innerHTML = customerOptions;
								document.jobForm.description.value = description;
								$('#basicPartsList').empty();
								$('#standardPartsList').empty();
								$('#premiumPartsList').empty();
			//document.jobForm.id.value = id;
			//document.jobForm.remove.value = displayMessage;

								var options = jobChildren[1];
								$(options).find('option').each(function() {
				//html += '<tr>';
				//html += '<td>' + jobId + '</td>';
				//html += '<td>' + customerName + '</td>';
				//html += '<td>' + customerId + '</td>';
				//html += '<td>' + typeName + '</td>';
				//html += '<td>' + typeId + '</td>';
				//html += '<td>' + description + '</td>';
									var $option = $(this);
									//var optionId = $option.attr('id');
									var optionId = new Number($option.attr('id'));
									//alert("ccJobCost populate optionId " + optionId);
				//var optionName = query4OptionName(optionId);
				//html += '<td>' + optionName + '</td>';
				//html += '<td>' + optionId + '</td>';
				//var selectId = jobId + "_" + optionId;
				//var selectHtml = '<select id="' + selectId + '">';
									var total = new Number(0);
									rowHtml = '';
									$($option).find('part').each(function() {
										var $part = $(this);
										partId = $part.attr('id');
										//var partInfo = query4PartInfoLocal(partId);
										var partInfo = partsDataCacheInfo[partId];
										partName = partInfo[0];
										var supplierName = partInfo[1];
										//partSku = partInfo[1];
										//partCost = partInfo[3];
										partSku = partInfo[2];
										partCost = partInfo[4];
										discount = 0;
										surcharge = 0;
										var partChildren = $part.children();
										quantity = 1;
										var partChildrenSize = partChildren.size();
										for (var i = 0; i < partChildrenSize; i++) {
											var partTag = partChildren[i].tagName;
						//alert("ccJobCost jobs part tag " + partTag);
											if (partTag == 'quantity') {
												if (partChildren[i].firstChild != null)
													quantity = partChildren[i].firstChild.nodeValue;
											} else if (partTag == 'sku') {
												if (partChildren[i].firstChild != null)
													partSku = partChildren[i].firstChild.nodeValue;
											} else if (partTag == 'discount') {
												if (partChildren[i].firstChild != null)
													discount = partChildren[i].firstChild.nodeValue;
											} else if (partTag == 'surcharge') {
												if (partChildren[i].firstChild != null)
													surcharge = partChildren[i].firstChild.nodeValue;
											}
										}
//var html1 = '<table id="basicPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody>';
					//var qtyPart = quantity + "-" + partName + "(" + partSku + ")";
					//selectHtml += '<option value="' + partId + '">' + qtyPart + '</option>';
										//total += computeCost(quantity, partCost, discount, surcharge);
										total = computeCost(quantity, partCost, discount, surcharge);
										supplierHtml = 'dummy';
										//rowHtml = '<tr><td>' + partId + '</td><td>' + partName + '</td><td>' + supplierHtml + '</td><td> ' + partSku + '</td><td>' + quantity + '</td><td>' + partCost + '</td><td>' + discount + '</td><td>' + surcharge + '</td><td>' + total + '</td><td></td></tr>';
									//alert("ccJobCost populate optionId " + optionId + " rowHtml " + rowHtml);
										if (optionId == optionIds[0]) {
											rowHtml = '<tr><td>' + partId + '</td><td>' + partName + '</td><td>' + supplierName + '</td><td><input type="text" name="basicSKU" style="width:60px;" value="' + partSku + '" /></td><td><input id="b_' + partId + '" type="text" name="basicQty" value="' + quantity + '" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + partCost + ')"/></td><td>' + partCost + '</td><td><input type="text" name="basicDisc" value="' + discount + '" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + partCost + ')"/></td><td><input type="text" name="basicSurc" value="' + surcharge + '" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + partCost + ')"/></td><td>' + total + '</td><td><input type="image" onclick="dropOptionPart(this, ' + optionId + ',' + partId + ', null)" src="images/delete.gif"/></td></tr>';
											html1 += rowHtml;
											enableJobSubmit();
									//alert("ccJobCost populate optionId " + optionId + " html1 " + html1);
										} else if (optionId == optionIds[2]) {
											rowHtml = '<tr><td>' + partId + '</td><td>' + partName + '</td><td>' + supplierName + '</td><td><input type="text" name="premiumSKU" style="width:60px;" value="' + partSku + '" /></td><td><input id="p_' + partId + '" type="text" name="premiumQty" value="' + quantity + '" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + partCost + ')"/></td><td>' + partCost + '</td><td><input type="text" name="premiumDisc" value="' + discount + '" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + partCost + ')"/></td><td><input type="text" name="premiumSurc" value="' + surcharge + '" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + partCost + ')"/></td><td>' + total + '</td><td><input type="image" onclick="dropOptionPart(this, ' + optionId + ',' + partId + ', null)" src="images/delete.gif"/></td></tr>';
											html3 += rowHtml;
											enableJobSubmit();
										} else {
											rowHtml = '<tr><td>' + partId + '</td><td>' + partName + '</td><td>' + supplierName + '</td><td><input type="text" name="standardSKU" style="width:60px;" value="' + partSku + '" /></td><td><input id="s_' + partId + '" type="text" name="standardQty" value="' + quantity + '" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + partCost + ')"/></td><td>' + partCost + '</td><td><input type="text" name="standardDisc" value="' + discount + '" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + partCost + ')"/></td><td><input type="text" name="standardSurc" value="' + surcharge + '" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + partCost + ')"/></td><td>' + total + '</td><td><input type="image" onclick="dropOptionPart(this, ' + optionId + ',' + partId + ', null)" src="images/delete.gif"/></td></tr>';
											html2 += rowHtml;
											enableJobSubmit();
									//alert("ccJobCost populate optionId " + optionId + " html2 " + html2);
										}
									});
									/*
							//supplierHtml = '<select name="basicSupplier" disabled="disabled">':
			var supplierOptions = deriveSupplierSelections(account, supplierId) + '</select>';
//alert("ccJobCost appendPartInfo supplierId " + supplierId + " options " + supplierOptions);
			switch (listType) {
				case 1: //basic				
					//supplierHtml = '<select name="basicSupplier" disabled="disabled">' + supplierOptions:
					supplierHtml = '<select name="basicSupplier" disabled="disabled">' + supplierOptions;
					//skuHtml = '<input type="text" name="basicSKU" ';
					skuHtml = '<input type="text" name="basicSKU" style="width:60px;" ';
					if (sku != 'n/a') {
						skuHtml += 'value="' + sku + '"';
					}
					skuHtml += '/>';
					basicPartsTable.fnAddData( [
					partId + "",
					name + "",
					supplierHtml + "",
					skuHtml + "",
					//'<input type="text" name="basicQty" value="1" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					'<input id="b_' + partId + '" type="text" name="basicQty" value="1" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					cost + "",
					'<input type="text" name="basicDisc" value="0" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					'<input type="text" name="basicSurc" value="0" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					cost + "",
					"&nbsp;"] );
					
									*/
				//selectHtml += '</select>';
				//html += '<td>' + selectHtml + '</td><td>' + total + '</td>';
				//html += '<td><input type="image" onclick="modify(1,' + loginAccountNumber + ',' + jobId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(1,' + loginAccountNumber + ',' + jobId + ')" src="images/delete.gif"/>&nbsp;<input type="image" onclick="downloadPDF(' + loginAccountNumber + ',' + jobId + ')" src="images/downloadpdfIcon.gif"/></td>';
				//html += '</tr>';
				//partID, partName, supplier, sku, qty, cost, discount, surcharge, total,action	
								});
								html1 += '</tbody></table>';
								html2 += '</tbody></table>';
								html3 += '</tbody></table>';
								$('#basicPartsList').append($(html1));
								$('#standardPartsList').append($(html2));
								$('#premiumPartsList').append($(html3));
								basicPartsTable = jQuery('#basicPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
								standardPartsTable = jQuery('#standardPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
								premiumPartsTable = jQuery('#premiumPartsTable').dataTable({
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					enableJobSubmit();
					return nRow;
				}
			});
								refreshParts(1);
								refreshParts(2);
								refreshParts(3);
								$("#jobTabs").tabs(
					
									{selected: 0
					
									});
									}
								});

	     //alert("ccJobCost populate id " + id + " displayMessage " + displayMessage);
			document.jobForm.id.value = id;
			document.jobForm.remove.value = displayMessage;
	     				    if (displayMessage == true) {
					    document.jobForm.type.disabled = 'disabled';
					    document.jobForm.customer.disabled = 'disabled';
					    document.jobForm.description.disabled = 'disabled';
					    //enableOrDisableJobSubmit();
					    $('#jobDialogMsg').show();
					    //todo disable inputs
				    }

								$("#jobDialog").dialog("open");
				
						} else {
						    // issue an error message for any other HTTP response
						    alert("An error has occurred: " + jobRequest.statusText);
						}
					    }
			});
			break;
		case 2:	//part
			var name;
			var supplierId;
			var sku;
			var attributes;
			var description;
			var cost;
			var partRequest = getXMLHTTPRequest();			
			//isDone = false;
			//$('#partList').empty();
			url = 'ccGetPartsXML.php?account=' + loginAccountNumber;
			requestXMLData(partRequest, url, function() {
			   if(partRequest.readyState == 4) {
				// if server HTTP response is "OK"
				if(partRequest.status == 200) {
				    var data = partRequest.responseXML;
				//var html = '<table id="partTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th></tr></thead><tbody>';
				//var html = '<table id="partTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Cost</th><th>Action(<input type="image" onclick="add(2,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
				var test = false;
				$(data).find('part').each(function() {
					var $part = $(this);
					//html += '<tr>';
					var partId = $part.attr('id');
					if (partId == id) {
						//html += '<td>' + $part.attr('id')+ '</td>';
						//html += '<td>' + partId + '</td>';
						var children = $part.children();
						//var partName = children[0].firstChild.nodeValue;
						name = children[0].firstChild.nodeValue;
						//html += '<td>' + partName + '</td>';
						var $supplier = $(children[1]);
						//var supplierId = $supplier.attr('id');
						supplierId = $supplier.attr('id');
						//var supplierName = deriveSupplierName(supplierId);
						//html += '<td>' + supplierId + '</td>';
						//html += '<td>' + supplierName + '</td>';
						var supplierChildren = $supplier.children();
						var supplierChildrenSize = supplierChildren.size();
						//if (test == false) {
						//	alert("ccJobCost parts supplier id " + supplierId + " children size" + supplierChildrenSize);
						//	test = true;
						//}
						//var cost = 0;
						//var sku = 'n/a';
						//var attributes = 'n/a';
						//var description = partName;
						cost = 0;
						sku = 'n/a';
						attributes = 'n/a';
						description = name;
						for (var i = 0; i < supplierChildrenSize; i++) {
							var supplierTag = supplierChildren[i].tagName;
							//alert("ccJobCost parts supplier tag " + supplierTag);
							if (supplierTag == 'sku') {
								//sku = supplierChildren[i].firstChild.nodeValue;
								if (supplierChildren[i].firstChild != null)
									sku = supplierChildren[i].firstChild.nodeValue;
							}
							else if (supplierTag == 'attributes') {
								//attributes = supplierChildren[i].firstChild.nodeValue;
								if (attributes = supplierChildren[i].firstChild != null)
								attributes = supplierChildren[i].firstChild.nodeValue;
							}
							else if (supplierTag == 'description') {
								//description = supplierChildren[i].firstChild.nodeValue;
								if (supplierChildren[i].firstChild != null)
								description = supplierChildren[i].firstChild.nodeValue;
							}
							else if (supplierTag == 'cost') {
								cost = supplierChildren[i].firstChild.nodeValue;
							}
						}
					}
					//html += '<td>' + sku + '</td>';
					//html += '<td>' + attributes + '</td>';
					//html += '<td>' + description + '</td>';
					//html += '<td>' + cost + '</td>';
					//html += '<td><input type="image" onclick="modify(2,' + loginAccountNumber + ',' + partId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(2,' + loginAccountNumber + ',' + partId + ')" src="images/delete.gif"/></td>';
					//html += '</tr>';
				});
				//html += '</tbody></table>';
				//$('#partList').append($(html));

			     //isDone = true;
				    document.partForm.name.value = name;
				    document.partForm.supplier.innerHTML = deriveSupplierSelections(account, supplierId);
				    document.partForm.sku.value = sku;
				    document.partForm.attributes.value = attributes;
				    document.partForm.description.value = description;
				    document.partForm.cost.value = cost;
				    document.partForm.id.value = id;
				    document.partForm.remove.value = displayMessage;
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName + " id " + id + " remove " + displayMessage);
				    if (displayMessage == true) {
					    document.partForm.name.disabled = 'disabled';
					    document.partForm.supplier.disabled = 'disabled';
					    document.partForm.sku.disabled = 'disabled';
					    document.partForm.attributes.disabled = 'disabled';
					    document.partForm.description.disabled = 'disabled';
					    document.partForm.cost.disabled = 'disabled';
					    $('#partDialogMsg').show();
					    //todo disable inputs
				    }
				    $("#partDialog").dialog("open");
		
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + partRequest.statusText);
				}
			    }
			});
			//document.partForm.id.value = 0;
			//document.partForm.remove.value = false;
			//$("#partDialog").dialog("open");
			break;
		case 3:	//supplier
			var name;
			var phone;
			var url;
			var lastName;
			var firstName;
			var supplierRequest = getXMLHTTPRequest();			
			//$('#supplierList').empty();
			var url = 'ccGetSuppliersXML.php?account=' + loginAccountNumber;
			requestXMLData(supplierRequest, url, function() {
			   if(supplierRequest.readyState == 4) {
				// if server HTTP response is "OK"
				if(supplierRequest.status == 200) {
				    var data = supplierRequest.responseXML;
				//var html = '<table id="supplierTable"><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>URL</th><th>Action(<input type="image" onclick="add(3,' + loginAccountNumber + ')" src="images/icon_plus.gif"/>)</th></tr></thead><tbody>';
				$(data).find('supplier').each(function() {
					var $supplier = $(this);
					//html += '<tr>';
					var supplierId = $supplier.attr('id');
					if (supplierId == id) {
						//html += '<td>' + supplierId + '</td>';
						//var $supplier = $(children[1]);
						//var supplierId = $supplier.attr('id');
						//html += '<td>' + supplierId + '</td>';
						var supplierChildren = $supplier.children();
						var supplierChildrenSize = supplierChildren.size();
						//if (test == false) {
						//	alert("ccJobCost parts supplier id " + supplierId + " children size" + supplierChildrenSize);
						//	test = true;
						//}
						//var name;
						//var phone = 'n/a';
						//var url = 'n/a';
						lastName = '';
						firstName = '';
						phone = 'n/a';
						url = 'n/a';
						//var description = partName;
						for (var i = 0; i < supplierChildrenSize; i++) {
							var supplierTag = supplierChildren[i].tagName;
							//alert("ccJobCost parts supplier tag " + supplierTag);
							if (supplierTag == 'name') {
								//sku = supplierChildren[i].firstChild.nodeValue;
								if (supplierChildren[i].firstChild != null)
									name = supplierChildren[i].firstChild.nodeValue;
							}
							else if (supplierTag == 'phone') {
								//attributes = supplierChildren[i].firstChild.nodeValue;
								if (supplierChildren[i].firstChild != null)
								phone = supplierChildren[i].firstChild.nodeValue;
							}
							else if (supplierTag == 'url') {
								//description = supplierChildren[i].firstChild.nodeValue;
								if (supplierChildren[i].firstChild != null)
								url = supplierChildren[i].firstChild.nodeValue;
							}
							//else if (supplierTag == 'cost') {
							//	cost = supplierChildren[i].firstChild.nodeValue;
							//}
						}
					}
					//html += '<td>' + name + '</td>';
					//html += '<td>' + phone + '</td>';
					//html += '<td>' + url + '</td>';
					//html += '<td>' + cost + '</td>';
		
					//var children = $supplier.children();
					//html += '<td>' + children[0].firstChild.nodeValue + '</td>';					
					//html += '<td>' + children[1].firstChild.nodeValue + '</td>';					
					//html += '<td>' + children[2].firstChild.nodeValue + '</td>';					
					//html += '<td><input type="image" onclick="modify(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/edit.gif"/>&nbsp;<input type="image" onclick="remove(3,' + loginAccountNumber + ',' + supplierId + ')" src="images/delete.gif"/></td>';
					//html += '</tr>';
				});
				//html += '</tbody></table>';
				//$('#supplierList').append($(html));
				    document.supplierForm.name.value = name;
				    document.supplierForm.phone.value = phone;
				    document.supplierForm.url.value = url;
				    document.supplierForm.lastName.value = lastName;
				    document.supplierForm.firstName.value = firstName;
				    document.supplierForm.id.value = id;
				    document.supplierForm.remove.value = displayMessage;
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName + " id " + id + " remove " + displayMessage);
				    if (displayMessage == true) {
					    document.supplierForm.name.disabled = 'disabled';
					    document.supplierForm.phone.disabled = 'disabled';
					    document.supplierForm.url.disabled = 'disabled';
					    document.supplierForm.lastName.disabled = 'disabled';
					    document.supplierForm.firstName.disabled = 'disabled';
					    $('#supplierDialogMsg').show();
					    //todo disable inputs
				    }
				    $("#supplierDialog").dialog("open");

			     //isDone = true;
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + supplierRequest.statusText);
				}
			    }
			});
			//document.supplierForm.id.value = 0;
			//document.supplierForm.remove.value = false;
			//$("#supplierDialog").dialog("open");
			break;
		case 4:	//customer
			var lastName;
			var firstName;
			var customerRequest = getXMLHTTPRequest();
			var url = 'ccGetCustomersXML.php?account=' + loginAccountNumber;
			//alert("ccJobCost populate url " + url);
			requestXMLData(customerRequest, url, function() {
			   if(customerRequest.readyState == 4) {
				// if server HTTP response is "OK"
			//alert("ccJobCost readyState 4 customerRequest.status " + customerRequest.status);
				if(customerRequest.status == 200) {
				    var data = customerRequest.responseXML;
				    $(data).find('customer').each(function() {
					var $customer = $(this);
					var customerId = $customer.attr('id');
					if (customerId == id) {
						var children = $customer.children();
						lastName = children[0].firstChild.nodeValue;
						firstName = children[1].firstChild.nodeValue;
					}
				    });
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName);
				    document.customerForm.lastname.value = lastName;
				    document.customerForm.firstname.value = firstName;
				    document.customerForm.id.value = id;
				    document.customerForm.remove.value = displayMessage;
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName + " id " + id + " remove " + displayMessage);
				    if (displayMessage == true) {
					    document.customerForm.lastname.disabled = 'disabled';
					    document.customerForm.firstname.disabled = 'disabled';
					    $('#customerDialogMsg').show();
					    //todo disable inputs
				    }
				    $("#customerDialog").dialog("open");
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + customerRequest.statusText);
				}
			   }
			});

			break;
		case 5:	//type
			var name;
			var description;
			//document.customerForm.id.value = 0;
			//document.customerForm.remove.value = false;
			//$("#typeDialog").dialog("open");
			var typeRequest = getXMLHTTPRequest();
			//$('#typeList').empty();
			//isDone = false;
			url = 'ccGetTypesXML.php?account=' + loginAccountNumber;
			requestXMLData(typeRequest, url, function() {
			   if(typeRequest.readyState == 4) {
				// if server HTTP response is "OK"
				if(typeRequest.status == 200) {
				    var data = typeRequest.responseXML;
				//var html = '<table id="typeTable"><thead><tr><th>ID</th><th>Name</th></tr></thead><tbody>';
				$(data).find('type').each(function() {
					var $type = $(this);
					//html += '<tr>';
					//html += '<td>' + $type.attr('id')+ '</td>';
					var typeId = $type.attr('id');
					if (typeId == id) {
						var children = $type.children();
						//html += '<td>' + children[0].firstChild.nodeValue + '</td>';
						name = children[0].firstChild.nodeValue;
					}
					//html += '</tr>';
				});
				//html += '</tbody></table>';
			     //isDone = true;
				    document.typeForm.name.value = name;
				    //document.typeForm.description.value = name;
				    document.typeForm.id.value = id;
				    document.typeForm.remove.value = displayMessage;
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName + " id " + id + " remove " + displayMessage);
				    if (displayMessage == true) {
					    document.typeForm.name.disabled = 'disabled';
					    document.typeForm.description.disabled = 'disabled';
					    $('#typeDialogMsg').show();
					    //todo disable inputs
				    }
				    $("#typeDialog").dialog("open");
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + typeRequest.statusText);
				}
			    }
			});

			break;
		case 6:	//option
			//document.customerForm.id.value = 0;
			//document.customerForm.remove.value = false;
			//$("#optionDialog").dialog("open");
			var name;
			var description;
			//document.customerForm.id.value = 0;
			//document.customerForm.remove.value = false;
			//$("#typeDialog").dialog("open");
			var optionRequest = getXMLHTTPRequest();
			url = 'ccGetOptionsXML.php?account=' + loginAccountNumber;
			requestXMLData(optionRequest, url, function() {
			   if(optionRequest.readyState == 4) {
				// if server HTTP response is "OK"
				if(optionRequest.status == 200) {
				    var data = optionRequest.responseXML;
				$(data).find('option').each(function() {
					var $option = $(this);
					var optionId = $option.attr('id');
					if (optionId == id) {
						var children = $option.children();
						name = children[0].firstChild.nodeValue;
					}
				});
				    document.optionForm.name.value = name;
				    //document.typeForm.description.value = name;
				    document.optionForm.id.value = id;
				    document.optionForm.remove.value = displayMessage;
				    //alert("ccJobCost populate lastName " + lastName + " firstName " + firstName + " id " + id + " remove " + displayMessage);
				    if (displayMessage == true) {
					    document.optionForm.name.disabled = 'disabled';
					    document.optionForm.description.disabled = 'disabled';
					    $('#optionDialogMsg').show();
					    //todo disable inputs
				    }
				    $("#optionDialog").dialog("open");
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + optionRequest.statusText);
				}
			    }
			});
			break;
		default:			
	}

}

function processForm(tabId) {
	var account = loginAccountNumber;
	isDone = false;
	//alert("ccJobCost processForm tabId " + tabId + " account " + account);
	//process the form
	switch(tabId) {
		case 0:
		case 1:
			//var refresher = refreshJobs;
			//var name = document.jobForm.name.value;
			var description = document.jobForm.description.value;
			var typeId = document.jobForm.type.value;
			var customerId = document.jobForm.customer.value;
			var id = document.jobForm.id.value;
			//here is Clone button support - creates new job from existing one
			if (tabId == 0) {
				id = 0;
				tabId = 1;
			}
			var remove = document.jobForm.remove.value;
			var jobRequest = getXMLHTTPRequest();
			//url = 'ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
			//url = 'ccJobs.php?account=' + account + '&name=' + name + '&typeId=' + typeId + '&customerId=' + customerId + '&id=' + id + '&remove=' + remove;
			url = 'ccJobs.php?account=' + account + '&description=' + description + '&typeId=' + typeId + '&customerId=' + customerId + '&id=' + id + '&remove=' + remove;
	//alert("ccJobCost processForm url " + url);
			requestXMLData(jobRequest, url, function() {
			//requestXMLData(customerRequest, url, function(refresher) {
			   if(jobRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + customerRequest.status);
				// if server HTTP response is "OK"
				//if(customerRequest.status == 200) {
				if(jobRequest.status == 200 || jobRequest.status == 0) {
				    //refreshCustomers();
				    //refresher();
				    //refreshCustomers();
					//var jobId;
					var jobId = id;
					if (id == 0) {
				    	    var data = jobRequest.responseXML;
				$(data).find('job').each(function() {
					var $job = $(this);
					//var jobId = $job.attr('id');
					jobId = $job.attr('id');
					//alert("ccJobCost processForm job id " + jobId);
					//alert("ccJobCost processForm tabId " + tabId + " account " + account + " id " + id + " job id " + jobId);
				});
					}
				//processJobOptions(jobId);
				processJobOptions(jobId, remove);
				    isDone = true;
				    $("#jobDialog").dialog("close");
refreshAll(tabId - 1);
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + jobRequest.statusText);
				}
			    }
			});
			break;
		case 2:	//parts
		/*
			partInfo.push(partName); // name
			partInfo.push(supplierName); // supplier
			partInfo.push(sku); // sku
			partInfo.push(attributes); // attributes
			partInfo.push(cost); // cost
			partInfo.push(supplierId); // supplierId
			partsDataCacheInfo[partId] = partInfo;		
		*/
			var refresher = refreshParts;
			var name = document.partForm.name.value;
			if (name == null || name.length == 0) {
				alert("ERROR: The part name cannot be blank!");
				return;
			}
			var supplierId = document.partForm.supplier.value;
			var sku = document.partForm.sku.value;
			var attributes = document.partForm.attributes.value;
			var description = document.partForm.description.value;
			var cost = document.partForm.cost.value;
			var id = document.partForm.id.value;
			if (id == 0 && sku != "" && supplierId != "") {
				//alert("ccJobCost processForm partsDataCacheInfo.length " + typesDataCacheInfo.length);
				for (var i in partsDataCacheInfo) {
				//alert("ccJobCost processForm i " + i);
					var aSupplierId = partsDataCacheInfo[i][5];
					var aSku = partsDataCacheInfo[i][2];
					if (aSupplierId == supplierId && aSku == sku) {
						alert("ERROR: The part already exists for the supplier with same SKU!");
						return;
					}
				}
			}
			var remove = document.partForm.remove.value;
			var partRequest = getXMLHTTPRequest();
			url = 'ccParts.php?account=' + account + '&name=' + name + '&supplierId=' + supplierId + '&sku=' + sku + '&attributes=' + attributes + '&description=' + description + '&cost=' + cost + '&id=' + id + '&remove=' + remove;
	//alert("ccJobCost processForm tabId " + tabId + " url " + url);
			requestXMLData(partRequest, url, function() {
			   if(partRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + partRequest.status);
				if(partRequest.status == 200 || partRequest.status == 0) {
				    //refreshParts();
				    isDone = true;
				    $("#partDialog").dialog("close");
refreshAll(tabId - 1);
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + partRequest.statusText);
				}
			    }
			});
			break;
		case 3:	//suppliers
			var refresher = refreshSuppliers;
			var name = document.supplierForm.name.value;
			if (name == null || name.length == 0) {
				alert("ERROR: The supplier name cannot be blank!");
				return;
			}
			var phone = document.supplierForm.phone.value;
			var url = document.supplierForm.url.value;
			var last = document.supplierForm.lastname.value;
			var first = document.supplierForm.firstname.value;
			var id = document.supplierForm.id.value;
			if (id == 0) {
				//alert("ccJobCost processForm suppliersDataCacheInfo.length " + typesDataCacheInfo.length);
				for (var i in suppliersDataCacheInfo) {
				//alert("ccJobCost processForm i " + i);
					var aSupplierName = suppliersDataCacheInfo[i][0];
					if (aSupplierName == name) {
						alert("ERROR: The supplier name already exists!");
						return;
					}
				}
			}
			var remove = document.supplierForm.remove.value;
			var supplierRequest = getXMLHTTPRequest();
			url = 'ccSuppliers.php?account=' + account + '&name=' + name + '&phone=' + phone + '&url=' + url + '&last=' + last + '&first=' + first + '&id=' + id + '&remove=' + remove;
	//alert("ccJobCost processForm tabId " + tabId + " url " + url);
			requestXMLData(supplierRequest, url, function() {
			   if(supplierRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + customerRequest.status);
				if(supplierRequest.status == 200 || supplierRequest.status == 0) {
				    //refreshCustomers();
				    isDone = true;
				    $("#supplierDialog").dialog("close");
refreshAll(tabId - 1);
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + supplierRequest.statusText);
				}
			    }
			});
			break;
		case 4:	//customers
		////http://localhost/ccCustomers.php?account=0&last='lastNameB'&first='firstNameB'

			//$("#customerDialog").dialog("open");
			//var last = document.customerForm.lastname;
			//var first = document.customerForm.firstname;
			var refresher = refreshCustomers;
			var last = document.customerForm.lastname.value;
			var first = document.customerForm.firstname.value;
			if (last == null || last.length == 0) {
				alert("ERROR: The last name cannot be blank!");
				return;
			}
			if (first == null || first.length == 0) {
				alert("ERROR: The first name cannot be blank!");
				return;
			}
			var id = document.customerForm.id.value;
			if (id == 0) {
				//alert("ccJobCost processForm customersDataCacheInfo.length " + customersDataCacheInfo.length);
				for (var i in customersDataCacheInfo) {
				//alert("ccJobCost processForm i " + i);
					var aFirstName = customersDataCacheInfo[i][1];
					var aLastName = customersDataCacheInfo[i][0];
				//alert("ccJobCost processForm aFirstName " + aFirstName + " aLastName " + aLastName + " first " + first + " last " + last);
					if (aLastName == last && aFirstName == first) {
						alert("ERROR: The first and last names already exist!");
						return;
					}
				}
			}
			var remove = document.customerForm.remove.value;
			var customerRequest = getXMLHTTPRequest();
			//url = 'ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
			url = 'ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first + '&id=' + id + '&remove=' + remove;
			//url = 'http://localhost/ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
	//alert("ccJobCost processForm url " + url);
			requestXMLData(customerRequest, url, function() {
			//requestXMLData(customerRequest, url, function(refresher) {
			   if(customerRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + customerRequest.status);
				// if server HTTP response is "OK"
				//if(customerRequest.status == 200) {
				if(customerRequest.status == 200 || customerRequest.status == 0) {
				    //refreshCustomers();
				    //refresher();
				    //refreshCustomers();
				    isDone = true;
				    $("#customerDialog").dialog("close");
refreshAll(tabId - 1);
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + customerRequest.statusText);
				}
			    }
			});
			break;
		case 5:	//types
		////http://localhost/ccCustomers.php?account=0&last='lastNameB'&first='firstNameB'

			//$("#customerDialog").dialog("open");
			//var last = document.customerForm.lastname;
			//var first = document.customerForm.firstname;
			var refresher = refreshTypes;
			var name = document.typeForm.name.value;
			if (name == null || name.length == 0) {
				alert("ERROR: The type name cannot be blank!");
				return;
			}
			var description = document.typeForm.description.value;
			if (description == null || description.length == 0) {
				//description = ' ';
				description = name;
			}
			var id = document.typeForm.id.value;
			if (id == 0) {
				//alert("ccJobCost processForm typesDataCacheInfo.length " + typesDataCacheInfo.length);
				for (var i in typesDataCacheInfo) {
				//alert("ccJobCost processForm i " + i);
					var aTypeName = typesDataCacheInfo[i][0];
					if (aTypeName == name) {
						alert("ERROR: The type name already exists!");
						return;
					}
				}
			}
			var remove = document.typeForm.remove.value;
			var typeRequest = getXMLHTTPRequest();
			//url = 'ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
			url = 'ccTypes.php?account=' + account + '&name=' + name + '&description=' + description + '&id=' + id + '&remove=' + remove;
			//url = 'http://localhost/ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
	//alert("ccJobCost processForm tabId " + tabId + " url " + url);
			requestXMLData(typeRequest, url, function() {
			//requestXMLData(customerRequest, url, function(refresher) {
			   if(typeRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + customerRequest.status);
				// if server HTTP response is "OK"
				//if(customerRequest.status == 200) {
				if(typeRequest.status == 200 || typeRequest.status == 0) {
				    //refreshCustomers();
				    //refresher();
				    //refreshCustomers();
				    isDone = true;
				    //typeTableReference.fnDraw();
				    $("#typeDialog").dialog("close");
refreshAll(tabId - 1);
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + typeRequest.statusText);
				}
			    }
			});
			break;
		case 6:	//options
		////http://localhost/ccCustomers.php?account=0&last='lastNameB'&first='firstNameB'

			//$("#customerDialog").dialog("open");
			//var last = document.customerForm.lastname;
			//var first = document.customerForm.firstname;
			var refresher = refreshOptions;
			var name = document.optionForm.name.value;
			var description = document.optionForm.description.value;
			var id = document.optionForm.id.value;
			var remove = document.optionForm.remove.value;
			var optionRequest = getXMLHTTPRequest();
			//url = 'ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
			url = 'ccOptions.php?account=' + account + '&name=' + name + '&description=' + description + '&id=' + id + '&remove=' + remove;
			//url = 'http://localhost/ccCustomers.php?account=' + account + '&last=' + last + '&first=' + first;
	//alert("ccJobCost processForm url " + url);
			requestXMLData(optionRequest, url, function() {
			//requestXMLData(customerRequest, url, function(refresher) {
			   if(optionRequest.readyState == 4) {
	//alert("ccJobCost processForm readyState 4 status " + customerRequest.status);
				// if server HTTP response is "OK"
				//if(customerRequest.status == 200) {
				if(optionRequest.status == 200 || optionRequest.status == 0) {
				    //refreshCustomers();
				    //refresher();
				    //refreshCustomers();
				    isDone = true;
				    $("#optionDialog").dialog("close");
refreshAll(tabId - 1);
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + optionRequest.statusText);
				}
			    }
			});
			break;
		default:			
	}
	//awaitAjaxProcess(true);
	//tjs091207
	//awaitAjaxProcess(true, noop);
	return true;	
}

//function deriveSupplierSelections(account) {
function deriveSupplierSelections(account, id) {
	//       var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";
 
	var html = '';
	$('#supplierTable tbody tr').each(function(n) {
		var $row = $(this);
		var children = $row.children();
	//alert("ccJobCost deriveSupplierSelections children size " + children.size());
		var rowId = children[0].firstChild.nodeValue;
		var nameChild = children[1];
		var nameChildFirstChild = nameChild.firstChild;
		var nameChildFirstChildValue = nameChildFirstChild.nodeValue;
		if (rowId == id) {
			html += '<option value="' + rowId + '" selected="selected">';
		} else {
	//alert("ccJobCost deriveSupplierSelections nameChildFirstChildValue " + nameChildFirstChildValue);
			html += '<option value="' + rowId + '">';
		}
		//html += children[1].firstChild.nodeValue); // name
		//html += rowId; // name
		//html += children[0].childNodes[1].nodeValue; // name
		html += nameChildFirstChildValue; // name
		html += '</option>';
	});
	//alert("ccJobCost deriveSupplierSelections html " + html);
	return html;
}

function deriveSupplierName(supplierId) {
	//       var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";
 //alert("ccJosCost deriveSupplierName supplierId " + supplierId);
 var supplierInfo = suppliersDataCacheInfo[supplierId];
	//var name = '';
	var name = supplierInfo[0];
	//alert("ccJobCost deriveSupplierSelections html " + html);
	return name;
}

function deriveTypeSelections(account, id) {
	//       var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";
 
	var html = '';
	for (rowId in typesDataCacheInfo)
  {
		if (rowId == id) {
			html += '<option value="' + rowId + '" selected="selected">';
		} else {
	//alert("ccJobCost deriveSupplierSelections nameChildFirstChildValue " + nameChildFirstChildValue);
			html += '<option value="' + rowId + '">';
		}
		html += typesDataCacheInfo[rowId][0]; // name
		html += '</option>';
  }
	//alert("ccJobCost deriveSupplierSelections html " + html);
	return html;
}

function deriveCustomerSelections(account, id) {
	//       var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";
 
	var html = '';
	for (rowId in customersDataCacheInfo)
  {
		if (rowId == id) {
			html += '<option value="' + rowId + '" selected="selected">';
		} else {
	//alert("ccJobCost deriveSupplierSelections nameChildFirstChildValue " + nameChildFirstChildValue);
			html += '<option value="' + rowId + '">';
		}
		html += customersDataCacheInfo[rowId][0] + ', ' + customersDataCacheInfo[rowId][1]; // name
		html += '</option>';
  }
 	//alert("ccJobCost deriveSupplierSelections html " + html);
	return html;
}

function append(listType, account, partId) {
	//alert("ccJobCost append list type " + listType + " partId " + partId);
	appendPartInfo(listType, account, partId);
}

function appendPartInfo(listType, account, id) {
var name;
var supplierId;
var sku;
var attributes;
var description;
var cost;
var supplierHtml;
var skuHtml;
var costHtml;
var partRequest = getXMLHTTPRequest();			
url = 'ccGetPartsXML.php?account=' + loginAccountNumber;
//alert ("ccJobCost query4PartInfo account " + account + " id " + id + " url " + url);
requestXMLData(partRequest, url, function() {
   if(partRequest.readyState == 4) {
	// if server HTTP response is "OK"
	if(partRequest.status == 200) {
	    var data = partRequest.responseXML;
	var test = false;
	$(data).find('part').each(function() {
		var $part = $(this);
		var partId = $part.attr('id');
		if (partId == id) {
			var children = $part.children();
			name = children[0].firstChild.nodeValue;
			var $supplier = $(children[1]);
			supplierId = $supplier.attr('id');
			var supplierChildren = $supplier.children();
			var supplierChildrenSize = supplierChildren.size();
			cost = 0;
			sku = 'n/a';
			attributes = 'n/a';
			description = name;
			for (var i = 0; i < supplierChildrenSize; i++) {
				var supplierTag = supplierChildren[i].tagName;
				//alert("ccJobCost parts supplier tag " + supplierTag);
				if (supplierTag == 'sku') {
					//sku = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
						sku = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'attributes') {
					//attributes = supplierChildren[i].firstChild.nodeValue;
					if (attributes = supplierChildren[i].firstChild != null)
					attributes = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'description') {
					//description = supplierChildren[i].firstChild.nodeValue;
					if (supplierChildren[i].firstChild != null)
					description = supplierChildren[i].firstChild.nodeValue;
				}
				else if (supplierTag == 'cost') {
					cost = supplierChildren[i].firstChild.nodeValue;
				}
			}
			//supplierHtml = '<select name="basicSupplier" disabled="disabled">':
			var supplierName = deriveSupplierName(supplierId);
			//var supplierOptions = deriveSupplierSelections(account, supplierId) + '</select>';
//alert("ccJobCost appendPartInfo supplierId " + supplierId + " options " + supplierOptions);
//var indicesList;
			switch (listType) {
				case 1: //basic				
					//supplierHtml = '<select name="basicSupplier" disabled="disabled">' + supplierOptions:
					//supplierHtml = '<select name="basicSupplier" disabled="disabled">' + supplierOptions;
					//skuHtml = '<input type="text" name="basicSKU" ';
					skuHtml = '<input type="text" name="basicSKU" style="width:60px;" ';
					if (sku != 'n/a') {
						skuHtml += 'value="' + sku + '"';
					}
					skuHtml += '/>';
					basicPartsTable.fnAddData( [
					partId + "",
					name + "",
					//supplierHtml + "",
					supplierName + "",
					skuHtml + "",
					//'<input type="text" name="basicQty" value="1" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					'<input id="b_' + partId + '" type="text" name="basicQty" value="1" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					cost + "",
					'<input type="text" name="basicDisc" value="0" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					'<input type="text" name="basicSurc" value="0" style="width:40px;" onChange="changeQty(1, ' + partId + ',' + cost + ')"/>',
					cost + "",
					'<input type="image" onclick="dropOptionPart(this, null,' + partId + ',1)" src="images/delete.gif"/>']);
					//"&nbsp;"] );
					
				break;
				case 3: //premium
					//supplierHtml = '<select name="premiumSupplier" disabled="disabled">' + supplierOptions;
					skuHtml = '<input type="text" name="premiumSKU" style="width:60px;" ';
					if (sku != 'n/a') {
						skuHtml += 'value="' + sku + '"';
					}
					skuHtml += '/>';
					premiumPartsTable.fnAddData( [
					partId + "",
					name + "",
					//supplierHtml + "",
					supplierName + "",
					skuHtml + "",
					'<input id="p_' + partId + '" type="text" name="premiumQty" value="1" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + cost + ')" />',
					cost + "",
					'<input type="text" name="premiumDisc" value="0" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + cost + ')" />',
					'<input type="text" name="premiumSurc" value="0" style="width:40px;" onChange="changeQty(3, ' + partId + ',' + cost + ')" />',
					cost + "",
					'<input type="image" onclick="dropOptionPart(this, null,' + partId + ',3)" src="images/delete.gif"/>']);
					//"&nbsp;"] );
				break;
				default:
				case 2: // standard
					//supplierHtml = '<select name="standardSupplier" disabled="disabled">' + supplierOptions;
					skuHtml = '<input type="text" name="standardSKU" style="width:60px;" ';
					if (sku != 'n/a') {
						skuHtml += 'value="' + sku + '"';
					}
					skuHtml += '/>';
					standardPartsTable.fnAddData( [
					partId + "",
					name + "",
					//supplierHtml + "",
					supplierName + "",
					skuHtml + "",
					//'<input type="text" name="standardQty" value="1" style="width:40px;" />',
					//'<input type="text" name="standardQty" value="1" style="width:40px;" change="changeQty(' + partId + ')" />',
					//'<input type="text" name="standardQty" value="1" style="width:40px;" onChange="changeQty(' + partId + ')" />',
					'<input id="s_' + partId + '" type="text" name="standardQty" value="1" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + cost + ')" />',
					cost + "",
					'<input type="text" name="standardDisc" value="0" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + cost + ')" />',
					'<input type="text" name="standardSurc" value="0" style="width:40px;" onChange="changeQty(2, ' + partId + ',' + cost + ')" />',
					cost + "",
					'<input type="image" onclick="dropOptionPart(this, null,' + partId + ',2)" src="images/delete.gif"/>']);
					//"&nbsp;"] );
					/*
					//todo just consider last row added - use index
					//var nodes = $( standardPartsTable.fnGetNodes() );
					//alert("ccJobCost appendPartInfo nodes length " + nodes.length);
					$( standardPartsTable.fnGetNodes()).filter(function() {
						//var row = this;
		var $row = $(this);
		var children = $row.children();
		//id, name, supplier combo, sku, qty, cost, discount, surcharge, total
	//alert("ccJobCost deriveOptionIds children size " + children.size());
		//var partId = children[0].firstChild.nodeValue;
		//alert("ccJobCost appendPartInfo partId " + partId);
		//var qtyElm = children[5].firstChild;
		var qtyElm = children[4].firstChild;
		//var qtyVal = qtyElm.value;
		//alert("ccJobCost appendPartInfo qtyVal " + qtyVal); //e.g. 1
		//var qtyName = qtyElm.name;
		//alert("ccJobCost appendPartInfo qtyName " + qtyName); //e.g. standardQty
		//qtyElm.click = changeQty;
		//qtyElm.click = function() {
		//	alert("ccJobCost changeQty");
		//};
		//qtyElm.change = changeQty;
						//$('#standardPartsTable tbody td:nth-child(5)').bind('click', function() {
				//alert("ccJobCost add");
				//var qty = this;
				//var val = qty.value;
				//alert("add qty changed value " + val);
			//});
			//children
					});
					*/
				break;
			}
		}
	});
	} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + partRequest.statusText);
				}
			    }
			});
	return;
}

//function changeQty() {
//function changeQty(partId) {
function changeQty(listType, partId, cost) {
	//standardPartsTable
	//alert("ccJobCost changeQty listType " + listType + " partId " + partId + " cost " + cost);
	/*
	var tableName = "standardPartsTable";
	if (listType == 1) {
		tableName = "basicPartsTable";
	} else if (listType == 3) {
		tableName = "premiumPartsTable";
	}
	*/
	var qtyId = "s_" + partId;
	if (listType == 1) {
		qtyId = "b_" + partId;
	} else if (listType == 3) {
		qtyId = "p_" + partId;
	}
	//       var queryStr = "#ca_" + nodeId + " input[type=text]";
        //var queryStr = "#ca_" + nodeId + " table tbody td:nth-child(2)";
 
	//var queryStr = '#' + tableName + ' tbody ';
	var queryStr = '#' + qtyId;
	var queryResult = $(queryStr);
	var qtyInputElm = queryResult.get(0);
	//alert("ccJobCost changeQty listType " + listType + " partId " + partId + " cost " + cost + " qty " + qtyInputElm.value);
	var qtyColumn = queryResult.parent();
	var costDiscSurchTotalColumns = qtyColumn.nextAll();
	//var discInputElm = $(costDiscSurchTotalColumns[1] )
	
	var discColumn = costDiscSurchTotalColumns.get(1);
	//var discColumnChildren = discColumn.children();
	//var discInputElm = discColumnChildren[0].firstchild;
	var discInputElm = discColumn.childNodes[0];
	//alert("ccJobCost changeQty listType " + listType + " partId " + partId + " cost " + cost + " qty " + qtyInputElm.value + " discount " + discInputElm.value);
	var surchColumn = costDiscSurchTotalColumns.get(2);
	var surchInputElm = surchColumn.childNodes[0];
	var total = computeCost(qtyInputElm.value, cost, discInputElm.value, surchInputElm.value);
	//alert("ccJobCost changeQty listType " + listType + " partId " + partId + " cost " + cost + " total " + total);
	var totalColumn = costDiscSurchTotalColumns.get(3);
	var totalElm = totalColumn.childNodes[0];
	//var oldTotal = totalElm.innerHTML;
	var oldTotal = totalElm.nodeValue;
	//alert("ccJobCost changeQty listType " + listType + " partId " + partId + " cost " + cost + " total " + total + " old total " + oldTotal);
	//totalElm.innerHTML = total;
	totalElm.nodeValue = total;
}

//function processJobOptions(jobId) {
function processJobOptions(jobId, isRemoval) {
	//need to derive the (for now) limited number of three option id's
	var optionIds = deriveOptionIds();
	var account = loginAccountNumber;
	isDone = false;
	//alert("ccJobCost processJobOptions jobId " + jobId);
	//process the job options
	var jobOptionRequest = getXMLHTTPRequest();
	//first remove all options
	//http://localhost/ccJobOptionsX.php?account=0&optionId=1&id=4
	//url = 'ccJobOptionsX.php?account=' + account + '&optionId=1&id=' + jobId;
	url = 'ccJobOptionsX.php?account=' + account + '&optionId=' + optionIds[0] + '&id=' + jobId;
//alert("ccJobCost processJobOptions url " + url + " isRemoval " + isRemoval);
	requestXMLData(jobOptionRequest, url, function() {
	   if(jobOptionRequest.readyState == 4) {
//alert("ccJobCost processJobOptions readyState 4 status " + customerRequest.status);
		// if server HTTP response is "OK"
		if(jobOptionRequest.status == 200 || jobOptionRequest.status == 0) {
			url = 'ccJobOptionsX.php?account=' + account + '&optionId=' + optionIds[1] + '&id=' + jobId;
		//alert("ccJobCost processJobOptions url " + url);
			requestXMLData(jobOptionRequest, url, function() {
			   if(jobOptionRequest.readyState == 4) {
		//alert("ccJobCost processJobOptions readyState 4 status " + customerRequest.status);
				// if server HTTP response is "OK"
				if(jobOptionRequest.status == 200 || jobOptionRequest.status == 0) {
					url = 'ccJobOptionsX.php?account=' + account + '&optionId=' + optionIds[2] + '&id=' + jobId;
				//alert("ccJobCost processJobOptions url " + url);
					requestXMLData(jobOptionRequest, url, function() {
					   if(jobOptionRequest.readyState == 4) {
				//alert("ccJobCost processJobOptions readyState 4 status " + customerRequest.status);
						// if server HTTP response is "OK"
						if(jobOptionRequest.status == 200 || jobOptionRequest.status == 0) {

//alert("ccJobCost processJobOptions isRemoval " + isRemoval);
							//if (!isRemoval) {
							//if (isRemoval == false) {
							if (isRemoval != true) {
//now insert all options, basic, standard, premium
//alert("ccJobCost processJobOptions url " + url);
//insertJobOptions(1, jobId);
var optionsTable = 'basicPartsTable';
insertJobOptions(optionIds[0], jobId, optionsTable);
optionsTable = 'standardPartsTable';
//alert("ccJobCost processJobOptions optionsTable " + optionsTable + " optionIds[1] " + optionIds[1]);
insertJobOptions(optionIds[1], jobId, optionsTable);
optionsTable = 'premiumPartsTable';
insertJobOptions(optionIds[2], jobId, optionsTable);
							}


						} else {
						    // issue an error message for any other HTTP response
						    alert("An error has occurred: " + jobOptionRequest.statusText);
						}
					    }
					});
			
				} else {
				    // issue an error message for any other HTTP response
				    alert("An error has occurred: " + jobOptionRequest.statusText);
				}
			    }
			});
	
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + jobOptionRequest.statusText);
		}
	    }
	});

}

function deriveOptionIds() {
	var optionIds = new Array();
	var queryStr = "#optionTable tbody tr";
	$(queryStr).each(function(n) {
		var $row = $(this);
		var children = $row.children();
	//alert("ccJobCost deriveOptionIds children size " + children.size());
		var optionId = children[0].firstChild.nodeValue;
		optionIds.push(optionId);
	});
	return optionIds;	
}

//todo use datatable API to obtain aoData for this purpose
//function insertJobOptions(optionId, jobId) {
function insertJobOptions(optionId, jobId, optionsTable) {
	var account = loginAccountNumber;
	var jobInsertOptionRequest = getXMLHTTPRequest();
	/*
	//alert("ccJobCost insertJobOptions optionId " + optionId + " jobId " + jobId + " optionsTable " + optionsTable);
// e.g. var html1 = '<table id="basicPartsTable"><thead><tr><th>ID</th><th>Part</th><th>Supplier</th><th>SKU</th><th>Quantity</th><th>Cost</th><th>Discount</th><th>Surcharge</th><th>Total</th><th>Action</th></tr></thead><tbody></tbody></table>';
	var optionIds = deriveOptionIds();
	var aData;
	if (optionId == optionIds[0]) {
		// Get the data array for all rows 
		aData = basicPartsTable.fnGetData();
	} else if (optionId == optionIds[2]) {
		// Get the data array for all rows 
		aData = premiumPartsTable.fnGetData();
	} else {
		// Get the data array for all rows 
		aData = standardPartsTable.fnGetData();
	}
	alert("ccJobCost insertJobOptions optionId " + optionId + " jobId " + jobId + " aData.length " + aData.length);
	//for (var i = 0; i < aData.length(); i++) {
	for (var i = 0; i < aData.length; i++) {
		var aRow = aData[i];
		alert("ccJobCost insertJobOptions aRow.length " + aRow.length);
		alert("ccJobCost insertJobOptions aRow[0] " + aRow[0] + " aRow[3] " + aRow[3] + " aRow[4] " + aRow[4] + " aRow[5] " + aRow[5] + " aRow[6] " + aRow[6]);
		
		//var partId = aRow[0].firstChild.nodeValue;
		var partId = aRow[0];
		var sku = aRow[3].firstChild.value;
		var quantity = aRow[4].firstChild.value;
		var discount = aRow[5].firstChild.value;
		var surcharge = aRow[6].firstChild.value;
	url = 'ccJobOptions.php?account=' + account + '&optionId=' + optionId + '&partId='+partId + '&sku=' + sku + '&quantity=' + quantity + '&discount=' + discount + '&surcharge=' + surcharge + '&id=' + jobId;
alert("ccJobCost insertJobOptions url " + url);
	requestXMLData(jobInsertOptionRequest, url, function() {
	   if(jobInsertOptionRequest.readyState == 4) {
//alert("ccJobCost insertJobOptions readyState 4 status " + customerRequest.status);
		// if server HTTP response is "OK"
		if(jobInsertOptionRequest.status == 200 || jobInsertOptionRequest.status == 0) {
			//noop
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + jobInsertOptionRequest.statusText);
		}
	    }
	});
		
	}
	*/
	
var queryStr = '#' + optionsTable + ' tbody tr';
	//alert("ccJobCost insertJobOptions queryStr " + queryStr + " optionId " + optionId + " jobId " + jobId);
	$(queryStr).each(function(n) {
	//alert("ccJobCost insertJobOptions in results of queryStr");
		var $row = $(this);
		var children = $row.children();
		var numberOfChildren = children.size();
	//alert("ccJobCost insertJobOptions children size " + children.size());
	//alert("ccJobCost insertJobOptions children size " + numberOfChildren);
	if (numberOfChildren > 1) {
		var partId = children[0].firstChild.nodeValue;
		var sku = children[3].firstChild.value;
		var quantity = children[4].firstChild.value;
		var discount = children[6].firstChild.value;
		var surcharge = children[7].firstChild.value;
	       //alert("ccJobCost insertJobOptions jobId " + jobId + " partId " + partId + " sku " + skuChildFirstChildValue);
	      // alert("ccJobCost insertJobOptions optionId " + optionId + " jobId " + jobId + " partId " + partId + " sku " + skuChildFirstChildValue);
	       //alert("ccJobCost insertJobOptions optionId " + optionId + " jobId " + jobId + " partId " + partId);
	       //e.g. http://localhost/ccJobOptions.php?account=0&optionId=1&partId=1&sku=skua&quantity=1&discount=0&surcharge=0&id=4
	url = 'ccJobOptions.php?account=' + account + '&optionId=' + optionId + '&partId='+partId + '&sku=' + sku + '&quantity=' + quantity + '&discount=' + discount + '&surcharge=' + surcharge + '&id=' + jobId;
//alert("ccJobCost insertJobOptions url " + url);
	requestXMLData(jobInsertOptionRequest, url, function() {
	   if(jobInsertOptionRequest.readyState == 4) {
//alert("ccJobCost insertJobOptions readyState 4 status " + customerRequest.status);
		// if server HTTP response is "OK"
		if(jobInsertOptionRequest.status == 200 || jobInsertOptionRequest.status == 0) {
			//noop
		} else {
		    // issue an error message for any other HTTP response
		    alert("An error has occurred: " + jobInsertOptionRequest.statusText);
		}
	    }
	});
	}
	});
	
		//alert("ccJobCost insertJobOptions done");
}

function dropOptionPart(inputElm, optionId, partId, listType) {
	var index;
	//alert("ccJobCost dropOptionPart optionId " + optionId + " partId " + partId);
	var optionIds = deriveOptionIds();
	var optId = optionId;
	if (listType != null) {
		if (listType == 1) {
			optId = optionIds[0];
		} else if (listType == 3) {
			optId = optionIds[2];
		} else {
			optId = optionIds[1];
		}
	}

	var trElm = inputElm.parentNode.parentNode;
	if (optId == optionIds[0]) {
		     /* Get the position of the current data from the node */
		     index = basicPartsTable.fnGetPosition( trElm );
		     //alert("ccJobCost dropOptionPart basicPartsTable optionId " + optionId + " partId " + partId + " index " + index);
		     basicPartsTable.fnDeleteRow( index );
	} else if (optId == optionIds[2]) {
		     /* Get the position of the current data from the node */
		     index = premiumPartsTable.fnGetPosition( trElm );
		     //alert("ccJobCost dropOptionPart premiumPartsTable optionId " + optionId + " partId " + partId + " index " + index);
		     premiumPartsTable.fnDeleteRow( index );
	} else {
		     /* Get the position of the current data from the node */
		     index = standardPartsTable.fnGetPosition( trElm );
		     //alert("ccJobCost dropOptionPart standardPartsTable optionId " + optionId + " partId " + partId + " index " + index);
		     standardPartsTable.fnDeleteRow( index );
	}
	enableOrDisableJobSubmit();			
}

function enableOrDisableJobSubmit() {
	var enableSubmit = true;
	var disabled = "";
	var tableSettings;
	tableSettings = basicPartsTable.fnSettings();
	var aiRows = tableSettings.aiDisplayMaster; // all row numbers
	var basicPartsTableCount = aiRows.length;
	//alert("ccJobCost rowData basicPartsTable row count " + aiRows.length);
	tableSettings = standardPartsTable.fnSettings();
	aiRows = tableSettings.aiDisplayMaster; // all row numbers
	var standardPartsTableCount = aiRows.length;
	//alert("ccJobCost rowData standardPartsTable row count " + aiRows.length);
	tableSettings = premiumPartsTable.fnSettings();
	aiRows = tableSettings.aiDisplayMaster; // all row numbers
	var premiumPartsTableCount = aiRows.length;
	//alert("ccJobCost rowData premiumPartsTable row count " + aiRows.length);
		
	//alert("ccJobCost enableOrDisableJobSubmit isJobCreateMode " + isJobCreateMode + " basicPartsTableCount " + basicPartsTableCount + " standardPartsTableCount " + standardPartsTableCount + " premiumPartsTableCount " + premiumPartsTableCount);
	if (basicPartsTableCount == 0 && standardPartsTableCount == 0 && premiumPartsTableCount == 0) {
		enableSubmit = false;
	}
	
	//if (enableSubmit == false) {
	//alert("ccJobCost enableOrDisableJobSubmit enableSubmit " + enableSubmit);
	if (!enableSubmit) {
		disabled = "disabled";
	}
	var elm = $('#jobSubmit').get(0);
	//alert("ccJobCost enableOrDisableJobSubmit disabled <" + disabled + ">");
	elm.disabled = disabled;	
	if (!isJobCreateMode) {
		elm = $('#jobCreate').get(0);
		elm.disabled = disabled;
	}
}

function enableJobSubmit() {
	var elm = $('#jobSubmit').get(0);
	//alert("ccJobCost enableJobSubmit isJobCreateMode " + isJobCreateMode);
	elm.disabled = '';
	if (!isJobCreateMode) {
		elm = $('#jobCreate').get(0);
		elm.disabled = '';
	}
}
