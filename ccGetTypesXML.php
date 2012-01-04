<?php
/*
ccGetTypesXML.php
tjs 091119

file version 1.01 

release version 1.05
*/
//http://localhost/ccGetTypesXML.php
//http://localhost/ccGetTypesXML.php?account=0

$account = $_GET['account'];
//echo $account;

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
//$password="";
$database="COLLORG";


//mysql_connect(localhost,$username,$password);
mysql_connect("".MYSQL_HOST."",$username,$password);
//mysql_connect(127.0.0.1,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><types>";

$query="SELECT * FROM types where account = ".$account." and isInactive is null";
$result=mysql_query($query);
$num=mysql_numrows($result);
$i=0;
while ($i < $num) {
$typeId=mysql_result($result,$i,"id");

$typeName=mysql_result($result,$i,"name");
$type = '<type id="'.$typeId.'"><name>'.$typeName.'</name></type>';
echo $type;

$i++;
}

mysql_close();
echo "</types>";

?> 


