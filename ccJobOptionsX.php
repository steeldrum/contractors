<?php
/*
ccJobOptionsX.php
tjs 091204

file version 1.01 

release version 1.05
*/
//http://localhost/ccJobOptionsX.php?account=0&optionId=1&id=4

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

$id = $_GET['id'];

//tjs101011
define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";
$con = mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$sql="DELETE from jobOptions where jobId=$id and optionId=$_GET[optionId]";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
mysql_close();

?> 


