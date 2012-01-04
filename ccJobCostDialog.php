<?php
/*
tjs 091111

file version 1.00 

release version 1.00
*/

//echo "start";

$account = $_GET['account'];
require_once( "Member.class.php" );
session_start();

//$account = 0;
//if ($account == 0 && isset($_SESSION['member'])) {
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
} 
$jobId = $_GET['jobId'];

if (strlen($account) > 0) {
	//echo $account;
} else {
	echo "No account";
}
if (strlen($jobId) > 0) {
	//echo $jobId;
} else {
	echo "No jobId";
}

// set name of XML file
$file = "xml/".$account."/jobs.xml";

// load file
$jobs_xml = simplexml_load_file($file) or die ("Unable to load jobs XML file!");

//also load files to be queried
// account file
$file = "xml/".$account."/account.xml";
$account_xml = simplexml_load_file($file) or die ("Unable to load account XML file!");
// customer file
$file = "xml/".$account."/customers.xml";
$customers_xml = simplexml_load_file($file) or die ("Unable to load customers XML file!");
// type file
$file = "xml/".$account."/types.xml";
$types_xml = simplexml_load_file($file) or die ("Unable to load types XML file!");
// option file
$file = "xml/".$account."/options.xml";
$options_xml = simplexml_load_file($file) or die ("Unable to load options XML file!");
// part file
$file = "xml/".$account."/parts.xml";
$parts_xml = simplexml_load_file($file) or die ("Unable to load parts XML file!");

// access XML data
//echo "Parents: " . $xml->parents->mother . " and " .  $xml->parents->father . "\n";
//echo "description: " . $xml->job[0]->description . "\n";
echo "<h1>".$account_xml->name."</h1>";
echo "<h3>".$account_xml->street1."</h3>";
echo "<h3>".$account_xml->city.", ".$account_xml->state." ".$account_xml->zip."</h3>";
echo "<h3>TEL: ".$account_xml->phones[0]->phone."</h3>";
echo "<br/><h3>DATE: </h3>";
echo "<br/><h3>Quote</h3>";
echo "<hr/>";
echo "<h3>Quote to</h3>";



foreach($jobs_xml->job as $job) {
	if ($job['id'] == $jobId) {
		$customerId = $job['customerId'];
		//echo "customer id: " . $customerId ."\n";
		$xpathQuery = "//customer[@id='".$customerId."']";
		$result = $customers_xml->xpath($xpathQuery);
		$customerName = $result[0]->last.', '.$result[0]->first;
		//echo "customer name: " . $customerName ."\n";
		echo "<h3>" . $customerName ."</h3>";
		$typeId = $job['typeId'];
		//echo "type id: " . $job['typeId'] ."\n";
		//echo "type id: " . $typeId ."\n";
		$xpathQuery = "//type[@id='".$typeId."']";
		$result = $types_xml->xpath($xpathQuery);
		$typeName = $result[0]->name;
		//echo "type name: " . $typeName ."\n";
		//echo "description: " . $job->description . "\n";
		echo "<h3>job type: " . $typeName ."</h3>";
		echo "<h4>description: " . $job->description . "</h4>";
echo "<hr/>";
echo "<h3>Options</h3>";
		$options = $job->options;
		foreach($options->option as $option) {
			$optionCost = 0;
			$optionId = $option['id'];
			//echo "option id: " . $option['id'] ."\n";
			//echo "option id: " . $optionId ."\n";
			$xpathQuery = "//option[@id='".$optionId."']";
			$result = $options_xml->xpath($xpathQuery);
			$optionName = $result[0]->name;
			//echo "option name: " . $optionName ."\n";
			echo "<h4>option: <strong>" . $optionName ."</strong> (parts and labor)</h4>";
			echo "<table><thead><tr><th>Item Name</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Unit Price</th><th>Quantity</th><th>Price</th></tr></thead><tbody>";
			$parts = $option->parts;
			foreach($parts->part as $part) {
				$partId = $part['id'];
				//echo "part id: " . $part['id'] ."\n";
				//echo "part id: " . $partId ."\n";
				$xpathQuery = "//part[@id='".$partId."']";
				$result = $parts_xml->xpath($xpathQuery);
				$partName = $result[0]->name;
				//echo "part name: " . $partName ."\n";
				$quantity = $part->quantity;
				if (strlen($quantity) > 0) {
					//echo "quantity: " . $quantity;
				} else {
					$quantity = 1;
				}
				$supplier = $result[0]->supplier;
				$attributes = $supplier->attributes;
				if (strlen($attributes) > 0) {
					//echo "attributes: " . $attributes;
				}
				$sku = $part->sku;
				if (strlen($sku) > 0) {
					//echo "override sku: " . $sku;
				} else {
					$sku = $supplier->sku;
					if (strlen($sku) > 0) {
						//echo "sku: " . $sku;
					}
				}
				$partDescription = $supplier->description;
				if (strlen($partDescription) > 0) {
					//echo "partDescription: " . $partDescription;
				}
				$unitCost = 0;
				$partCost = $supplier->cost;
				if (strlen($partCost) > 0) {
					//echo "partCost: " . $partCost;
				}
				$discount = $part->discount;
				if (strlen($discount) > 0) {
					//echo "discount: " . $discount;
					$discountAmount = $discount;
					if ($discount < 1) {
						$discountAmount = $discount*$partCost;
					}
					$unitCost = $partCost - $discountAmount;
				} else {
					$surcharge = $part->surcharge;
					if (strlen($surcharge) > 0) {
						//echo "surcharge: " . $surcharge;
						$surchargeAmount = $surcharge;
						if ($surcharge < 1) {
							$surchargeAmount = $surcharge*$partCost;
						}
						$unitCost = $partCost + $surchargeAmount;
					} else {
						$unitCost = $partCost; 
					}
				}
				//echo "unitCost: " . $unitCost;
				$cost = $quantity*$unitCost;
			echo "<tr><td>".$partName."</td><td>".$sku."</td><td>".$attributes."</td><td>".$partDescription."</td><td>".$unitCost."</td><td>".$quantity."</td><td>".$cost."</td></tr>";
				
				//echo "cost: " . $cost;
				$optionCost += $cost;
			}
			//echo "optionCost: " . $optionCost;
			echo "<tr><td></td><td></td><td></td><td></td><td></td><td>TOTAL:</td><td>".$optionCost."</td></tr>";
		}
	}
}
?> 


