<?php
/*
ccGetCustomersXML.php
tjs 091119

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetCustomersXML.php
//http://localhost/ccGetCustomersXML.php?account=0

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
echo "<?xml version=\"1.0\" ?><customers>";

$query="SELECT * FROM customers where account = ".$account." and isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$customerId=mysql_result($result,$i,"id");

$lastName=mysql_result($result,$i,"last");
$firstName=mysql_result($result,$i,"first");
$customer = '<customer id="'.$customerId.'"><last>'.$lastName.'</last><first>'.$firstName.'</first></customer>';
echo $customer;

$i++;
}

mysql_close();
echo "</customers>";

?> 


