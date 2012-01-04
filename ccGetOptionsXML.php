<?php
/*
ccGetOptionsXML.php
tjs 091119

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetOptionsXML.php
//http://localhost/ccGetOptionsXML.php?account=2

$account = $_GET['account'];
//echo $account;
//start_session();
//session_start();
//if (isset($_SESSION["loginAccountNumber"])) {
//	$account = $_SESSION["loginAccountNumber"];
	//echo $account;
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
echo "<?xml version=\"1.0\" ?><options>";

$query="SELECT * FROM options where account = ".$account." and isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$optionId=mysql_result($result,$i,"id");

$optionName=mysql_result($result,$i,"name");
$option = '<option id="'.$optionId.'"><name>'.$optionName.'</name></option>';
echo $option;

$i++;
}

mysql_close();
echo "</options>";

?> 


