<?php
/*
ccGetSuppliersXML.php
tjs 091125

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetSuppliersXML.php?account=0

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


mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><suppliers>";

$query="SELECT * FROM suppliers where isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$supplierId=mysql_result($result,$i,"id");

$supplierName=mysql_result($result,$i,"name");
$supplierPhone=mysql_result($result,$i,"phone");
$supplierURL=mysql_result($result,$i,"URL");
$supplier = '<supplier id="'.$supplierId.'"><name>'.$supplierName.'</name><phone>'.$supplierPhone.'</phone><url>'.$supplierURL.'</url></supplier>';
echo $supplier;

$i++;
}

mysql_close();
echo "</suppliers>";

?> 


