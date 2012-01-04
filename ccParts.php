<?php
/*
ccParts.php
tjs 091130

file version 1.01 

release version 1.05
*/
//http://localhost/ccParts.php?account=0&last=lc8&first=fc8&id=5&remove=false

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
$remove = $_GET['remove'];

//tjs101011
define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";

$con = mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

if ($id == 0) {
// add the new part
$sql="INSERT INTO parts (account, name, supplierId, sku, attributes, description, cost)
VALUES
('$account','$_GET[name]','$_GET[supplierId]','$_GET[sku]','$_GET[attributes]','$_GET[description]','$_GET[cost]')";
} else {
	if ($remove == 'true') {
$sql = "UPDATE parts SET isinactive = 1
WHERE id = $id";
	} else {
$sql = "UPDATE parts SET name = '$_GET[name]',supplierId = '$_GET[supplierId]',sku = '$_GET[sku]',attributes = '$_GET[attributes]', description = '$_GET[description]', cost = '$_GET[cost]'
WHERE id = $id";
	}
}

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

mysql_close();

?> 


