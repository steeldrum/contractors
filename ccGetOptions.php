<?php
/*
ccGetOptions.php
tjs 091119

file version 1.01 

release version 1.05
*/

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


$username="root";
$password="root";
$database="COLLORG";
//tjs101011
define("MYSQL_HOST", "localhost");

//$sql = "SELECT * FROM `options` WHERE `account` = 0 LIMIT 0, 30 ";

mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

//$query = "INSERT INTO contacts VALUES ('','$first','$last','$phone','$mobile','$fax','$email','$web')";
//mysql_query($query);
//$query="SELECT * FROM contacts";
$query="SELECT * FROM options where account='.$account.' and isInactive is null";
//echo $query;
$result=mysql_query($query);
$num=mysql_numrows($result);
//echo $num;
$i=0;
while ($i < $num) {

$optionName=mysql_result($result,$i,"name");
echo $optionName;

$i++;
}

mysql_close();

?> 


