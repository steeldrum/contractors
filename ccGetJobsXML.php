<?php
/*
ccGetJobsXML.php
tjs 091120

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetJobsXML.php?account=0
/*
jobs:
id
account
customerId
typeId
description
dateCreated
dateModified

jobOptions:
jobId
optionId
partId
sku
quantity
discount
surcharge

e.g.
<job id="1" customerId="1" typeId="1">
<description>
upgrade bathroom first floor
</description>
<options>
<option id="1">
<parts>
<part id="1"/>
<part id="2">
</part>
<part id="6">
<quantity>
6
</quantity>
</part>
</parts>
</option>
</options>
</job>

*/

$account = $_GET['account'];
//session_start();
//if (isset($_SESSION['loginAccountNumber'])) {
//	$account = $_SESSION['loginAccountNumber'];
//}
require_once( "Member.class.php" );
session_start();

//$account = 0;
//if ($account == 0 && isset($_SESSION['member'])) {
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
} 

$username="root";
$password="root";
$database="COLLORG";
//tjs101011
define("MYSQL_HOST", "localhost");

mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><jobs>";

$query="SELECT * FROM jobs where account = ".$account." and isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$jobId=mysql_result($result,$i,"id");
$typeId=mysql_result($result,$i,"typeId");
$customerId=mysql_result($result,$i,"customerId");
echo '<job id="'.$jobId.'" typeId="'.$typeId.'" customerId="'.$customerId.'">';
$description =mysql_result($result,$i,"description");
echo '<description>'.$description.'</description><options>';

$query="SELECT * FROM jobOptions where jobId = ".$jobId." order by optionId";
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
$i2=0;
$lastOptionId = -1;
while ($i2 < $num2) {
$optionId=mysql_result($result2,$i2,"optionId");
if ($optionId != $lastOptionId) {
	if ($lastOptionId > 0) {
		echo '</parts></option>';
	}
	echo '<option id="'.$optionId.'"><parts>';
	$lastOptionId = $optionId;
}
$partId=mysql_result($result2,$i2,"partId");
$parta = '<part id="'.$partId.'">';
$sku =mysql_result($result2,$i2,"sku");
$skuPart = '<sku/>';
if (strlen($sku) > 0)
	$skuPart = '<sku>'.$sku.'</sku>';
$quantity =mysql_result($result2,$i2,"quantity");
$quantityPart = '<quantity/>';
if (strlen($quantity) > 0)
	$quantityPart = '<quantity>'.$quantity.'</quantity>';
$discount =mysql_result($result2,$i2,"discount");
$discountPart = '<discount/>';
if ($discount > 0)
	$discountPart = '<discount>'.$discount.'</discount>';
$surcharge=mysql_result($result2,$i2,"surcharge");
$surchargePart = '<surcharge/>';
if ($surcharge > 0)
	$surchargePart = '<surcharge>'.$surcharge.'</surcharge>';

	$part = $parta.$skuPart.$quantityPart.$discountPart.$surchargePart.'</part>';	
echo $part;

$i2++;
}
if ($num2 > 0) {
echo '</parts></option></options></job>';
} else {
echo '</options></job>';
}

$i++;
}

mysql_close();
echo "</jobs>";

?> 


