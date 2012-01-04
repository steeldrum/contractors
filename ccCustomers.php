<?php
/*
ccCustomers.php
tjs 091123

file version 1.01 

release version 1.05
*/
//http://localhost/ccCustomers.php?account=0&last=lc8&first=fc8&id=5&remove=false

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
//define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";

$con = mysql_connect('localhost',$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

if ($id == 0) {
// add the new customer
$sql="INSERT INTO customers (account, last, first)
VALUES
('$account','$_GET[last]','$_GET[first]')";
} else {
	if ($remove == 'true') {
$sql = "UPDATE customers SET isinactive = 1
WHERE id = $id";
	} else {
$sql = "UPDATE customers SET last = '$_GET[last]', first = '$_GET[first]'
WHERE id = $id";
	}
}

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

mysql_close();

?> 


