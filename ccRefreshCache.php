<?php
/*
ccRefreshCache.php
tjs 091231

file version 1.01 

release version 1.06
*/
//http://localhost/ccRefreshCache.php?account=0
//http://localhost/ccRefreshCache.php?account=0&jobId=1

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

//tjs101011
define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";

$jobId = $_GET['jobId'];

mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><jobs>";

//$query="SELECT * FROM jobs where id = ".$jobId." and account = ".$account." and isInactive is null";
$query="SELECT * FROM jobs where id = ".$jobId;
$result=mysql_query($query);
$num=mysql_numrows($result);
//echo "<num>$num</num>";
$i=0;
while ($i < $num) {
	
	
//$jobId=mysql_result($result,$i,"id");
$typeId=mysql_result($result,$i,"typeId");
$customerId=mysql_result($result,$i,"customerId");
//echo '<job id="'.$jobId.'" typeId="'.$typeId.'" customerId="'.$customerId.'">';
$jobDescription =mysql_result($result,$i,"description");
//echo '<description>'.$description.'</description><options>';

//create the types cache XML file...
$lines = "<?xml version=\"1.0\" ?><types>";
//$query="SELECT * FROM types where id = ".$typeId." and account = ".$account." and isInactive is null";
$query="SELECT * FROM types where id = ".$typeId." and account = ".$account;
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
//echo "<num2>$num2</num2>";
$i2=0;
while ($i2 < $num2) {
//$typeId=mysql_result($result,$i,"id");

$typeName=mysql_result($result2,$i2,"name");
$type = '<type id="'.$typeId.'"><name>'.$typeName.'</name></type>';
//echo $type;
$lines .= $type;

$i2++;
}
$lines .= "</types>";
$file = "xml/".$account."/types.xml";
$numChars = file_put_contents($file, $lines);
//echo "<numChars>$numChars</numChars>";

//create the customers cache XML file...
$lines = "<?xml version=\"1.0\" ?><customers>";
$query="SELECT * FROM customers where id = ".$customerId." and account = ".$account;
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
$i2=0;
while ($i2 < $num2) {
$lastName=mysql_result($result2,$i,"last");
$firstName=mysql_result($result2,$i,"first");
$customer = '<customer id="'.$customerId.'"><last>'.$lastName.'</last><first>'.$firstName.'</first></customer>';
//echo $customer;
$lines .= $customer;
$i2++;
}
$lines .= "</customers>";
$file = "xml/".$account."/customers.xml";
$numChars = file_put_contents($file, $lines);

//create the options cache XML file...
$lines = "<?xml version=\"1.0\" ?><options>";
$query="SELECT * FROM options where account = ".$account;
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
$i2=0;
while ($i2 < $num2) {
$optionId=mysql_result($result2,$i2,"id");
$optionName=mysql_result($result2,$i2,"name");
$option = '<option id="'.$optionId.'"><name>'.$optionName.'</name></option>';
//echo $option;
$lines .= $option;
$i2++;
}
$lines .= "</options>";
$file = "xml/".$account."/options.xml";
$numChars = file_put_contents($file, $lines);

//create the parts cache XML file...
$lines = "<?xml version=\"1.0\" ?><parts>";
$query="SELECT * FROM parts where account = 0 or account = ".$account;
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
$i2=0;
while ($i2 < $num2) {
$partId=mysql_result($result2,$i2,"id");
$supplierId=mysql_result($result2,$i2,"supplierId");
$sku =mysql_result($result2,$i2,"sku");
$attributes =mysql_result($result2,$i2,"attributes");
$description =mysql_result($result2,$i2,"description");
$cost =mysql_result($result2,$i2,"cost");
$partName=mysql_result($result2,$i2,"name");
$parta = '<part id="'.$partId.'"><name>'.$partName.'</name><supplier id="'.$supplierId.'">';
$skuPart = '<sku/>';
if (strlen($sku) > 0)
	$skuPart = '<sku>'.$sku.'</sku>';
$attributesPart = '<attributes/>';
if (strlen($attributes) > 0)
	$attributesPart = '<attributes>'.$attributes.'</attributes>';
$descriptionPart = '<description/>';
if (strlen($description) > 0)
	$descriptionPart = '<description>'.$description.'</description>';
$part = $parta.$skuPart.$attributesPart.$descriptionPart.'<cost>'.$cost.'</cost></supplier></part>';	
//echo $part;
$lines .= $part;
$i2++;
}
$lines .= "</parts>";
$file = "xml/".$account."/parts.xml";
$numChars = file_put_contents($file, $lines);

//create the jobs cache XML file...
$lines = "<?xml version=\"1.0\" ?><jobs>";
//echo '<job id="'.$jobId.'" typeId="'.$typeId.'" customerId="'.$customerId.'">';
$lines .= '<job id="'.$jobId.'" typeId="'.$typeId.'" customerId="'.$customerId.'">';
//$description =mysql_result($result,$i,"description");
//echo '<description>'.$jobDescription.'</description><options>';
$lines .= '<description>'.$jobDescription.'</description><options>';

$query="SELECT * FROM jobOptions where jobId = ".$jobId." order by optionId";
$result2=mysql_query($query);
$num2=mysql_numrows($result2);
$i2=0;
$lastOptionId = -1;
while ($i2 < $num2) {
$optionId=mysql_result($result2,$i2,"optionId");
if ($optionId != $lastOptionId) {
	if ($lastOptionId > 0) {
		//echo '</parts></option>';
		$lines .= '</parts></option>';
	}
	//echo '<option id="'.$optionId.'"><parts>';
	$lines .= '<option id="'.$optionId.'"><parts>';
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
//echo $part;
$lines .= $part;

$i2++;
}
if ($num2 > 0) {
//echo '</parts></option></options></job>';
$lines .= '</parts></option></options></job>';
} else {
//echo '</options></job>';
$lines .= '</options></job>';
}
$lines .= "</jobs>";
$file = "xml/".$account."/jobs.xml";
$numChars = file_put_contents($file, $lines);

$i++;
}

echo "</jobs>";

/*
echo "<?xml version=\"1.0\" ?><types>";
$lines = "<?xml version=\"1.0\" ?><types>";

$query="SELECT * FROM types where account = ".$account." and isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$typeId=mysql_result($result,$i,"id");

$typeName=mysql_result($result,$i,"name");
$type = '<type id="'.$typeId.'"><name>'.$typeName.'</name></type>';
//echo $type;
$lines .= $type;

$i++;
}

mysql_close();
echo "</types>";
$lines .= "</types>";
$file = "xml/".$account."/types.xml";
$numChars = file_put_contents($file, $lines);
*/
?> 


