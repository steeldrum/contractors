<?php
/*
ccJobOptions.php
tjs 091204

file version 1.01 

release version 1.05
*/
//http://localhost/ccJobOptions.php?account=0&optionId=1&partId=1&sku=skua&quantity=1&discount=0&surcharge=0&id=4

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

$username="root";
$password="root";
$database="COLLORG";

$con = mysql_connect(localhost,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
// add the new job option
$sql="INSERT INTO jobOptions (jobId, optionId, partId, sku, quantity, discount, surcharge)
VALUES
('$id','$_GET[optionId]','$_GET[partId]','$_GET[sku]','$_GET[quantity]','$_GET[discount]','$_GET[surcharge]')";

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
mysql_close();

?> 


