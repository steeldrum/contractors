<?php
/*
ccSuppliers.php
tjs 091125

file version 1.01 

release version 1.05
*/
//http://localhost/ccSuppliers.php?account=0&last=lc8&first=fc8&id=5&remove=false

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
/*
header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" ?><id>";
echo $id.'</id>';
*/

//tjs101011
define("MYSQL_HOST", "localhost");
$username="root";
$password="root";
$database="COLLORG";

$con = mysql_connect("".MYSQL_HOST."",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");

if ($id == 0) {
// add the new supplier
$sql="INSERT INTO suppliers (name, phone, url, contactLast, contactFirst)
VALUES
('$_GET[name]','$_GET[phone]','$_GET[url]','$_GET[last]','$_GET[first]')";
} else {
	if ($remove == 'true') {
$sql = "UPDATE suppliers SET isinactive = 1
WHERE id = $id";
	} else {
$sql = "UPDATE suppliers SET name = '$_GET[name]',phone = '$_GET[phone]',url = '$_GET[url]',contactLast = '$_GET[last]', contactFirst = '$_GET[first]'
WHERE id = $id";
	}
}

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

mysql_close();

?> 


